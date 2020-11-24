import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./Welcome.js";
import Logo from "./Logo.js";

let component = null;

if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = <Logo />;
}

ReactDOM.render(component, document.querySelector("main"));
