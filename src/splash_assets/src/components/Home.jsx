import React from "react"

import { useSplashContext } from "../store/SplashContext";
import Header from "./Header";
import { Project } from "./Project";

export const Home = () => {
    const [name, setName] = React.useState('');
    const [message, setMessage] = React.useState('');
    const { actor } = useSplashContext();

    async function doGreet() {
      const greeting = await actor.greet(name);
      setMessage(greeting);
    }  

  return (
    <div>
      <Header />
      <div style={{ "backgroundColor": "yellow" }}>
        <p>Greetings, from DFINITY!</p>
        <p>
          {" "}
          Type your message in the Name input field, then click{" "}
          <b> Get Greeting</b> to display the result.
        </p>
      </div>
      <div style={{ margin: "30px" }}>
        <input
          id="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        ></input>
        <button onClick={doGreet}>Get Greeting!</button>
      </div>
      <div>
        Greeting is: "
        <span style={{ color: "blue" }}>{message}</span>"
      </div>
      <Project />
    </div>
  )
}