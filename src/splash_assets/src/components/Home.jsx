import React from "react"
import CanvasKitInit from "canvaskit-wasm";
import { useSplashContext } from "../store/SplashContext";

export const Home = () => {
    const [name, setName] = React.useState('');
    const [message, setMessage] = React.useState('');
    const { actor, isAuthenticated, login, logout } = useSplashContext();

    async function doGreet() {
      const greeting = await actor.greet(name);
      setMessage(greeting);
    }  
  
    React.useEffect(() => {
      const loadCanvasKit = async () => {
        console.log("Loading");
        const CanvasKit = await CanvasKitInit();
        console.log(CanvasKit);
  
        const surface = CanvasKit.MakeCanvasSurface('foo');
  
        const paint = new CanvasKit.Paint();
        paint.setColor(CanvasKit.Color4f(0.9, 0, 0, 1.0));
        paint.setStyle(CanvasKit.PaintStyle.Stroke);
        paint.setAntiAlias(true);
        const rr = CanvasKit.RRectXY(CanvasKit.LTRBRect(10, 60, 210, 260), 25, 15);
    
        function draw(canvas) {
          canvas.clear(CanvasKit.WHITE);
          canvas.drawRRect(rr, paint);
        }
        surface.drawOnce(draw);
      };
  
      loadCanvasKit();
    }, [])

    return (
    <div style={{ "fontSize": "30px" }}>
      {isAuthenticated
        ? <button onClick={logout}>Logout</button>
        : <button onClick={login}>Login</button>
      }
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
      <canvas id="foo" width="300" height="300"></canvas>
    </div>
    )
}