import * as React from "react";
import { render } from "react-dom";
import { splash } from "../../declarations/splash";
import CanvasKitInit from "canvaskit-wasm";

const MyHello = () => {
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');

  async function doGreet() {
    const greeting = await splash.greet(name);
    setMessage(greeting);
  }

  React.useEffect(() => {
    const loadCanvasKit = async () => {
      console.log("Loading");
      const canvaskit = await CanvasKitInit();
      console.log(canvaskit);
    };

    loadCanvasKit();
  }, [])

  return (
    <div style={{ "fontSize": "30px" }}>
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
    </div>
  );
};

render(<MyHello />, document.getElementById("app"));

