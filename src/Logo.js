import React from "react";
import { Link } from "react-router-dom";
export default function Logo() {
    return (
        <div id="logo">
            <Link to="/">
                <img id="smallLogo" src="/logo.png"></img>
            </Link>
        </div>
    );
}
