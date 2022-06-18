import React, { createContext, ReactChild, useContext, useEffect, useState } from "react";
import { BackendActor, createActor } from "../lib/actor";
import { AuthClient } from '@dfinity/auth-client';
import { canisterId } from "../../../declarations/internet_identity";

export interface SplashProject {
    id: bigint;
    data: string;
}

export interface SplashContext {
  isAuthenticated: boolean,
  authClient: AuthClient | null,
  actor: BackendActor | null,
  projects: SplashProject[],
  login: () => void,
  logout: () => Promise<void>,
}

const splashContext = createContext<SplashContext>({
  isAuthenticated: false,
  authClient: null,
  actor: null,
  projects: [],
  login: () => {},
  logout: async () => {},
})

export function SplashContextProvider({ children }: { children: ReactChild }) {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<BackendActor | null>(null);
  const [projects, setProjects] = useState<SplashProject[]>([]);

  useEffect(() => {
    const loadActor = async () => {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);
      if (await authClient.isAuthenticated()) {
        onLogin();
      } else {
        setActor(createActor());
      }
    };

    loadActor();
  }, []);

  const onLogin = async () => {
    setActor(createActor({
      agentOptions: {
        identity: authClient.getIdentity(),
      },
    }));
    setAuthenticated(true);

    const projects = await actor.get_projects();
    setProjects(projects);
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
        onSuccess: onLogin,
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