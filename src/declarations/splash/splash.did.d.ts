import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Ciphertext = string;
export type DeviceAlias = string;
export type PublicKey = string;
export interface SplashProject { 'id' : bigint, 'data' : string }
export interface anon_class_15_1 {
  'add_project' : ActorMethod<[string], undefined>,
  'delete_project' : ActorMethod<[bigint], undefined>,
  'get_devices' : ActorMethod<[], Array<[DeviceAlias, PublicKey]>>,
  'get_projects' : ActorMethod<[], Array<SplashProject>>,
  'greet' : ActorMethod<[string], string>,
  'register_device' : ActorMethod<[DeviceAlias, PublicKey], boolean>,
  'remove_device' : ActorMethod<[DeviceAlias], undefined>,
  'update_project' : ActorMethod<[SplashProject], undefined>,
  'whoami' : ActorMethod<[], string>,
}
export interface _SERVICE extends anon_class_15_1 {}
