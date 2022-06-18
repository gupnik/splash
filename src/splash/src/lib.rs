use candid::CandidType;
use ic_cdk::api::{caller as caller_api};
use ic_cdk::export::{candid, Principal};
use ic_cdk::storage;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::BTreeMap;
use std::mem;
use std::collections::btree_map::Entry::{Vacant, Occupied};

type PrincipalName = String;
type PublicKey = String;
type Ciphertext = String;
type DeviceAlias = String;

#[derive(Clone, CandidType, Serialize, Deserialize)]
pub struct SplashProject {
    id: u128,
    data: String,
}

#[derive(Clone, CandidType, Serialize, Deserialize)]
struct CanisterState {
    counter: u128,
    projects: BTreeMap<PrincipalName, Vec<SplashProject>>,
    user_store: BTreeMap<Principal, UserStore>,
}

#[derive(Clone, CandidType, Serialize, Deserialize, Default)]
pub struct UserStore {
    device_list: BTreeMap<DeviceAlias, PublicKey>,
    ciphertext_list: BTreeMap<PublicKey, Ciphertext>,
}

impl UserStore {
    pub fn new() -> Self {
        Self::default()
    }
}

thread_local! {
    // Define dapp limits - important for security assurance
    static MAX_USERS: usize = 1_000;
    static MAX_PROJECTS_PER_USER: usize = 50;
    static MAX_DEVICES_PER_USER: usize = 6;
    static MAX_PROJECT_CHARS: usize = 5000;
    static MAX_DEVICE_ALIAS_LENGTH: usize = 200;
    static MAX_PUBLIC_KEY_LENGTH: usize = 500;
    static MAX_CYPHERTEXT_LENGTH: usize = 40_000;

    pub static NEXT_PROJECT: RefCell<u128> = RefCell::new(1);
    pub static PROJECTS_BY_USER: RefCell<BTreeMap<PrincipalName, Vec<SplashProject>>> = RefCell::new(BTreeMap::new());
    pub static USER_KEYS: RefCell<BTreeMap<Principal, UserStore>> = RefCell::new(BTreeMap::new());
}

fn caller() -> Principal {
    let caller = caller_api();
    // The anonymous principal is not allowed to interact with the 
    // splash canister.
    if caller == Principal::anonymous() {
        panic!("Anonymous principal not allowed to make calls.")
    }
    caller
}

#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[update(name = "whoami")]
fn whoami() -> String {
    caller_api().to_string()
}

fn users_invariant() -> bool {
    let num_users_with_projects = PROJECTS_BY_USER.with(|projects_ref| projects_ref.borrow().keys().len() as u128);
    let num_users_with_store = USER_KEYS.with(|user_keys_ref| user_keys_ref.borrow().keys().len() as u128);
    num_users_with_projects == num_users_with_store
}

/// Returns the current number of users.
/// Panics if [users_invariant] is violated.
fn user_count() -> usize {
    assert!(users_invariant());
    PROJECTS_BY_USER.with(|projects_ref| projects_ref.borrow().keys().len())
}

/// Check if this user has been registered
/// Note: [register_device] must be each user's very first update call.
/// See also: [users_invariant]
fn is_user_registered(principal: Principal) -> bool {
    USER_KEYS.with(|user_keys_ref| user_keys_ref.borrow().contains_key(&principal))
}

fn is_id_sane(id: u128) -> bool {
    MAX_PROJECTS_PER_USER.with(|max_projects_per_user| id < (*max_projects_per_user as u128) * (user_count() as u128))
}

#[update(name = "get_projects")]
fn get_projects() -> Vec<SplashProject> {
    let user = caller();
    assert!(is_user_registered(user));
    let user_str = user.to_string();
    PROJECTS_BY_USER.with(|projects_ref| {
        projects_ref
            .borrow()
            .get(&user_str)
            .cloned()
            .unwrap_or_default()
    })
}

#[update(name = "delete_project")]
fn delete_project(note_id: u128) {
    let user = caller();
    assert!(is_user_registered(user));
    assert!(is_id_sane(note_id));

    let user_str = user.to_string();
    // shared ownership borrowing
    PROJECTS_BY_USER.with(|projects_ref| {
        let mut writer = projects_ref.borrow_mut();
        if let Some(v) = writer.get_mut(&user_str) {
            v.retain(|item| item.id != note_id);
        }
    });
}

#[update(name = "update_project")]
fn update_project(project: SplashProject) {
    let user = caller();
    assert!(is_user_registered(user));
    assert!(project.data.chars().count() <= MAX_PROJECT_CHARS.with(|mnc| mnc.clone()));
    assert!(is_id_sane(project.id));

    let user_str = user.to_string();
    PROJECTS_BY_USER.with(|projects_ref| {
        let mut writer = projects_ref.borrow_mut();
        if let Some(old_project) = writer
            .get_mut(&user_str)
            .and_then(|projects| projects.iter_mut().find(|p| p.id == project.id))
        {
            old_project.data = project.data;
        }
    })
}

#[update(name = "add_note")]
fn add_project(project_data: String) {
    let user = caller();
    assert!(is_user_registered(user));
    assert!(project_data.chars().count() <= MAX_PROJECT_CHARS.with(|mnc| mnc.clone()));

    let user_str = user.to_string();
    let project_id = NEXT_PROJECT.with(|counter_ref| {
        let mut writer = counter_ref.borrow_mut();
        *writer += 1;
        *writer
    });

    PROJECTS_BY_USER.with(|notes_ref| {
        let mut writer = notes_ref.borrow_mut();
        let user_projects = writer.get_mut(&user_str)
            .expect(&format!("detected registered user {} w/o allocated notes", user_str)[..]);
        
        assert!(user_projects.len() < MAX_PROJECTS_PER_USER.with(|mnpu| mnpu.clone()));

        user_projects.push(SplashProject {
            id: project_id,
            data: project_data,
        });
    });
}

#[update(name = "register_device")]
fn register_device(alias: DeviceAlias, pk: PublicKey) -> bool {

    let caller = caller();
    assert!(MAX_DEVICE_ALIAS_LENGTH.with(|mdal| alias.len() <= mdal.clone()));
    assert!(MAX_PUBLIC_KEY_LENGTH.with(|mpkl| pk.len() <= mpkl.clone()));
    
    USER_KEYS.with(|user_keys_ref| {
        let mut writer = user_keys_ref.borrow_mut();
        match writer.entry(caller) {
            Vacant(empty_store_entry) => {
                // caller unknown ==> check invariants
                // A. can we add a new user?
                let user_count = PROJECTS_BY_USER.with(|projects_ref| projects_ref.borrow().keys().len());
                assert!(MAX_USERS.with(|mu| user_count < mu.clone()));
                // B. this caller does not have projects
                let principal_name = caller.to_string();
                assert!(PROJECTS_BY_USER.with(|projects_ref| !projects_ref.borrow().contains_key(&principal_name)));

                // ... then initialize the following:
                // 1) a new [UserStore] instance in [USER_KEYS]
                empty_store_entry.insert({
                    let mut dl = BTreeMap::new();
                    dl.insert(alias, pk);
                    UserStore {
                        device_list: dl,
                        ciphertext_list: BTreeMap::new(),
                    }
                });
                // 2) a new [Vec<EncryptedNote>] entry in [NOTES_BY_USER]
                PROJECTS_BY_USER.with(|projects_ref| 
                    projects_ref.borrow_mut().insert(principal_name, vec![]));
                
                // finally, indicate accept
                true
            },
            Occupied(mut store_entry) => {
                // caller is a registered user
                let store = store_entry.get_mut();
                let inv = MAX_DEVICES_PER_USER.with(|mdpu| store.device_list.len() < mdpu.clone());
                match store.device_list.entry(alias) {
                    Occupied(_) => {
                        // device alias already registered ==> indicate reject
                        false
                    },
                    Vacant(empty_device_entry) => {
                        // device not yet registered ==> check that user did not exceed limits
                        assert!(inv);
                        // all good ==> register device
                        empty_device_entry.insert(pk);
                        // indicate accept
                        true
                    }
                }
            }
        }
    })
}

/// Remove this user's device with given [alias]
///
/// Panics: 
///      [caller] is the anonymous identity
///      [caller] is not a registered user
///      [alias] exceeds [MAX_DEVICE_ALIAS_LENGTH]
///      [caller] has only one registered device (which we refuse to remove)
#[update(name = "remove_device")]
fn remove_device(alias: DeviceAlias) {
    let user = caller();
    assert!(is_user_registered(user));
    assert!(MAX_DEVICE_ALIAS_LENGTH.with(|mdal| alias.len() <= mdal.clone()));

    USER_KEYS.with(|user_keys_ref| {
        let mut writer = user_keys_ref.borrow_mut();
        if let Some(user_store) = writer.get_mut(&user) {
            assert!(user_store.device_list.len() > 1);

            let pub_key = user_store.device_list.remove(&alias);
            if let Some(pk) = pub_key {
                // the device may or may not have an associated Ciphertext at this point
                user_store.ciphertext_list.remove(&pk);
            }
        }
    });
}

/// Returns:
///      Future vector of all (device, public key) pairs for this user's registered devices.
///
///      See also [get_notes] and "Queries vs. Updates"
/// Panics: 
///      [caller] is the anonymous identity
///      [caller] is not a registered user
#[update(name = "get_devices")]
fn get_devices() -> Vec<(DeviceAlias, PublicKey)> {
    let user = caller();
    assert!(is_user_registered(user));

    USER_KEYS.with(|user_keys_ref| {
        let reader = user_keys_ref.borrow_mut();
        match reader.get(&user) {
            Some(v) => {
                let out = v
                    .device_list
                    .iter()
                    .map(|(key, value)| (key.clone(), value.clone()))
                    .collect::<Vec<(DeviceAlias, PublicKey)>>();
                out
            }
            None => Vec::new(),
        }
    })
}

/// Returns:
///      Future vector of all public keys that are not already associated with a device.
///
///      See also [get_notes] and "Queries vs. Updates"
/// Panics: 
///      [caller] is the anonymous identity
///      [caller] is not a registered user
#[update(name = "get_unsynced_pubkeys")]
fn get_unsynced_pubkeys() -> Vec<PublicKey> {
    let user = caller();
    assert!(is_user_registered(user));

    USER_KEYS.with(|user_keys_ref| {
        let reader = user_keys_ref.borrow();
        reader.get(&caller()).map_or_else(Vec::new, |v| {
            v.device_list
                .values()
                .filter(|value| !v.ciphertext_list.contains_key(*value))
                .cloned()
                .collect::<Vec<PublicKey>>()
        })
    })
}

/// Returns: 
///      `true` iff the user has at least one public key.
///
///      See also [get_notes] and "Queries vs. Updates"
/// Panics: 
///      [caller] is the anonymous identity
///      [caller] is not a registered user
#[update(name = "is_seeded")]
fn is_seeded() -> bool {
    let user = caller();
    assert!(is_user_registered(user));

    USER_KEYS.with(|user_keys_ref| {
        let reader = user_keys_ref.borrow();
        reader
            .get(&user)
            .map_or(false, |v| !v.ciphertext_list.is_empty())
    })
}

#[pre_upgrade]
fn pre_upgrade() {
    let copied_counter: u128 = NEXT_PROJECT.with(|counter_ref| {
        let reader = counter_ref.borrow();
        *reader
    });
    PROJECTS_BY_USER.with(|projects_ref| {
        USER_KEYS.with(|user_keys_ref| {
            let old_state = CanisterState {
                projects: mem::take(&mut projects_ref.borrow_mut()),
                counter: copied_counter,
                user_store: mem::take(&mut user_keys_ref.borrow_mut()),
            };
            // storage::stable_save is the API used to write canister state out.
            // More explicit error handling *can* be useful, but if we fail to read out/in stable memory on upgrade
            // it means the data won't be accessible to the canister in any way.
            storage::stable_save((old_state,)).unwrap();
        })
    });
}

#[post_upgrade]
fn post_upgrade() {
    let (old_state,): (CanisterState,) = storage::stable_restore().unwrap();
    PROJECTS_BY_USER.with(|projects_ref| {
        NEXT_PROJECT.with(|counter_ref| {
            USER_KEYS.with(|user_keys_ref| {
                *projects_ref.borrow_mut() = old_state.projects;
                *counter_ref.borrow_mut() = old_state.counter;
                *user_keys_ref.borrow_mut() = old_state.user_store;
            })
        })
    });
}