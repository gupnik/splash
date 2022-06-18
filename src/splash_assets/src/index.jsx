import * as React from "react";
import { render } from "react-dom";
import { Home } from "./components/Home";
import { SplashContextProvider } from "./store/SplashContext";

const MyHello = () => {
  return (
    <SplashContextProvider>
      <Home />
    </SplashContextProvider>
  );
};

render(<MyHello />, document.getElementById("app"));

