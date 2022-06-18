import React, { createContext, ReactChild, useContext, useEffect, useState } from "react";
import { BackendActor, createActor } from "../lib/actor";
// import { splash } from "../../../declarations/splash";

export interface SplashProject {
    id: bigint;
    data: string;
}

export interface SplashContext {
    actor: BackendActor | null,
    projects: SplashProject[]
}

const splashContext = createContext<SplashContext>({
    actor: null,
    projects: []
})

export function SplashContextProvider({ children }: { children: ReactChild }) {
    const [actor, setActor] = useState<BackendActor | null>(null);
    const [projects, setProjects] = useState<SplashProject[]>([]);

    useEffect(() => {
        const loadActor = async () => {
            const actor = await createActor();
            setActor(actor);

            // const projects = await actor.get_projects();
            // setProjects(projects);
        };

        loadActor();
    }, [])

    return (
        <splashContext.Provider
            value={{
                actor,
                projects
            }}>
            {children}
        </splashContext.Provider>
    )
}

export function useSplashContext(): SplashContext {
    return useContext(splashContext)
}