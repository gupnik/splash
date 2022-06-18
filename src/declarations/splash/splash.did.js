export const idlFactory = ({ IDL }) => {
  const DeviceAlias = IDL.Text;
  const PublicKey = IDL.Text;
  const SplashProject = IDL.Record({ 'id' : IDL.Nat, 'data' : IDL.Text });
  const anon_class_15_1 = IDL.Service({
    'add_project' : IDL.Func([IDL.Text], [], []),
    'delete_project' : IDL.Func([IDL.Int], [], []),
    'get_devices' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(DeviceAlias, PublicKey))],
        [],
      ),
    'get_projects' : IDL.Func([], [IDL.Vec(SplashProject)], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'register_device' : IDL.Func([DeviceAlias, PublicKey], [IDL.Bool], []),
    'remove_device' : IDL.Func([DeviceAlias], [], ['oneway']),
    'update_project' : IDL.Func([SplashProject], [], []),
    'whoami' : IDL.Func([], [IDL.Text], []),
  });
  return anon_class_15_1;
};
export const init = ({ IDL }) => { return []; };
