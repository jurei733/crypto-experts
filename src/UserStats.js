import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveUserData, receiveCoinsBalance } from "./actions.js";
import Chart from "chart.js";

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

    useEffect(() => {
        var ctx = canvas.current;
        //line chart data
        var data = {
            labels: currencies,
            datasets: [
                {
                    label: "Chart",
                    data: totals,
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
        new Chart(ctx, {
            type: "pie",
            data: data,
            options: options,
        });
    }, [currencies, coinBalance, totals, user]);

    return (
        <div className="userStats">
            <canvas ref={canvas} id="myChart"></canvas>

            {coinBalance &&
                coinBalance.map((coin) => (
                    <p key={coin.currency}>
                        <strong>{coin.currency}</strong>&nbsp;&nbsp;
                        <strong>Amount:{coin.sum}</strong>&nbsp;&nbsp;
                        <strong>Price:{coin.price}</strong>&nbsp;&nbsp;
                        <strong>WORTH:{coin.total}</strong>
                    </p>
                ))}
            {user &&
                user.map((user) => (
                    <p key={user.id}>
                        <strong>FIAT:{user.balance} </strong>
                    </p>
                ))}
        </div>
    );
}
