import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveUserData, receiveCoinsBalance } from "./actions.js";
import Chart from "chart.js";

let chart = null;

export default function UserStats() {
    const canvas = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveUserData());
        dispatch(receiveCoinsBalance());
    }, []);

    const user = useSelector((store) => store.user);
    const coinBalance = useSelector((store) => store.coinBalance);
    const currencies = useSelector((store) => store.currencies);
    const totals = useSelector((store) => store.totals);
    const totalSum = useSelector((store) => store.totalSum);

    useEffect(() => {
        if (chart) chart.destroy();
        console.log("USER BALANCE", user.balance);
        var ctx = canvas.current;
        console.log("CURRENCIES&TOTALS", currencies, totals);
        //line chart data
        var data = {
            labels: [...currencies, "FIAT"],
            datasets: [
                {
                    label: "Chart",
                    data: [...totals, user.balance],
                    backgroundColor: [
                        "Red",
                        "Yellow",
                        "Blue",
                        "Green",
                        "Pink",
                        "Brown",
                        "Purple",
                    ],
                    borderColor: "lightblue",
                    fill: false,
                    lineTension: 0,
                    radius: 5,
                },
            ],
        };

        //options
        var options = {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "",
                fontSize: 18,
                fontColor: "#111",
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16,
                },
            },
        };

        //create Chart class object
        chart = new Chart(ctx, {
            type: "pie",
            data: data,
            options: options,
        });
    }, [currencies, coinBalance, totals, user]);

    return (
        <div className="userStats">
            <div style={{ width: 300, height: 300 }}>
                <canvas ref={canvas} id="myChart"></canvas>
            </div>
            {coinBalance &&
                coinBalance.map((coin) => (
                    <p key={coin.currency}>
                        <strong>{coin.currency}</strong>&nbsp;&nbsp;
                        <strong>Amount:{coin.sum}</strong>&nbsp;&nbsp;
                        <strong>Price:{coin.price}</strong>&nbsp;&nbsp;
                        <strong>WORTH:{coin.total}</strong>
                    </p>
                ))}
            <p>
                <strong>TOTAL SUM CRYPTO:{totalSum} </strong>
            </p>
            <p>
                <strong>FIAT:{user && user.balance} </strong>
            </p>
            <p>
                <strong>TOTAL BALANCE{totalSum + user.balance} </strong>
            </p>
        </div>
    );
}
