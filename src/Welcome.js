import React from "react";
import { HashRouter, Route } from "react-router-dom";

import Login from "./Login";
import Registration from "./Registration";
import ResetPassword from "./ResetPassword";

export default function Welcome() {
    return (
        <div id="welcome">
            <img id="bigLogo" src="logo.png"></img>
            <h2>The greatest community of crypto enthusiasts</h2>
            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={ResetPassword} />
                </React.Fragment>
            </HashRouter>
        </div>
    );
}
