import React from "react";
import { HashRouter, Route } from "react-router-dom";

import Login from "./Login";
import Registration from "./Registration";

export default function Welcome() {
    return (
        <div id="welcome">
            <img id="bigLogo" src="logo.png"></img>
            <h2>the greatest community of trusted Cryto experts</h2>
            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </React.Fragment>
            </HashRouter>
        </div>
    );
}
