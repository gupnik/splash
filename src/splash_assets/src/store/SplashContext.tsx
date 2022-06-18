import React, { createContext, ReactChild, useContext, useEffect, useState } from "react";
import { BackendActor, createActor } from "../lib/actor";
import { AuthClient } from '@dfinity/auth-client';
import { canisterId } from "../../../declarations/internet_identity";
import { CanvasKit } from "canvaskit-wasm";
import { loadCanvasKit } from "../lib/utils";

export interface SplashProject {
    id: bigint;
    data: string;
}

export interface SplashContext {
  canvasKit: CanvasKit | null,
  isAuthenticated: boolean,
  authClient: AuthClient | null,
  actor: BackendActor | null,
  projects: SplashProject[],
  login: () => void,
  logout: () => Promise<void>,
}

const splashContext = createContext<SplashContext>({
  canvasKit: null,
  isAuthenticated: false,
  authClient: null,
  actor: null,
  projects: [],
  login: () => {},
  logout: async () => {},
})

export function SplashContextProvider({ children }: { children: ReactChild }) {
  const [canvasKit, setCanvasKit] = useState<CanvasKit | null>(null);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<BackendActor | null>(null);
  const [projects, setProjects] = useState<SplashProject[]>([]);

  useEffect(() => {
    const setupCanvasKit = async () => {
      const canvasKit = (await loadCanvasKit()) as unknown as CanvasKit;
      console.log(canvasKit);
      setCanvasKit(canvasKit);
    }

    const setupActor = async () => {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);
      if (await authClient.isAuthenticated()) {
        onLogin(authClient);
      } else {
        setActor(createActor());
      }
    };

    setupCanvasKit();
    setupActor();
  }, []);

  const onLogin = async (authClient: AuthClient) => {
    const actor = createActor({
      agentOptions: {
        identity: authClient.getIdentity(),
      },
    });
    setActor(actor);
    setAuthenticated(true);

    await actor.register_device('Splash', 'Key'); //TODO: Fix hard-coded values

    const projects = await actor.get_projects();
    setProjects(projects);
    console.log(projects);
  }
  
  const onLogout = async () => {
    setAuthenticated(false);
    setActor(createActor());
    setProjects([]);
  }

  const login = () => {
    if (!isAuthenticated) {
      authClient.login({
        maxTimeToLive: BigInt(1800) * BigInt(1_000_000_000),
        identityProvider:
          process.env.DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app/#authorize'
            : `http://${canisterId}.localhost:8000/#authorize`,
        onSuccess: () => { onLogin(authClient) },
      })
    }
  }

  const logout = async () => {
    if (isAuthenticated) {
      await authClient.logout();
      onLogout();
    }
  }

  return (
    <splashContext.Provider
        value={{
          canvasKit,
          isAuthenticated,
          authClient,
          actor,
          projects,
          login,
          logout
        }}>
        {children}
    </splashContext.Provider>
  )
}

export function useSplashContext(): SplashContext {
    return useContext(splashContext)
}