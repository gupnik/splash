import React from "react"

import { useSplashContext } from "../store/SplashContext";
import Header from "./Header";
import { Project } from "./Project";
import { Projects } from "./Projects";

export const Home = () => {
    const [name, setName] = React.useState('');
    const [message, setMessage] = React.useState('');
    const { actor, currentProject, isAuthenticated } = useSplashContext();

    async function doGreet() {
      const greeting = await actor.greet(name);
      setMessage(greeting);
    }  

  return (
    <div>
      <Header />
      { isAuthenticated ?
       (currentProject !== null
      ? <Project />
      : <Projects />)
      : <div />
      } 
    </div>
  )
}