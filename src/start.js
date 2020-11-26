import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./Welcome.js";
import App from "./App.js";

let component = null;

if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = <App />;
}

ReactDOM.render(component, document.querySelector("main"));
