import React, { useState, useEffect } from "react";
import axios from "./axios.js";

export default function Coins() {
    const [coins, setCoins] = useState([]);

    useEffect(() => {
        axios.get("/api/coins").then(({ data }) => {
            console.log(data);
            setCoins(data);
        });
    }, []);

    return (
        <div>
            <p>Here should be all the coins.</p>
        </div>
    );
}
