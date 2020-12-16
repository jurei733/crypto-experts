import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveUserData,
    receiveCoinsBalance,
    receiveCoins,
} from "./actions.js";
import Chart from "chart.js";

let chart = null;

export default function UserStats() {
    const [isLoading, setLoading] = useState(true);
    const canvas = useRef();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(receiveUserData());
        dispatch(receiveCoins());
        dispatch(receiveCoinsBalance());
    }, []);

    const user = useSelector((store) => store.user);
    const coinBalance = useSelector((store) => store.coinBalance);
    const currencies = useSelector((store) => store.currencies);
    const totals = useSelector((store) => store.totals);
    const totalSum = useSelector((store) => store.totalSum);
    const coins = useSelector((store) => store.coins);
    const coinImages = coins.map((coin) => {
        let obj = { name: coin.id, url: coin.image };
        return obj;
    });
    console.log("coinImages", coinImages);

    useEffect(() => {
        if (chart) chart.destroy();
        console.log("USER BALANCE", user.balance);
        var ctx = canvas.current;
        console.log("CURRENCIES&TOTALS", currencies, totals);
        //line chart data
        var data = {
            labels: [...currencies, "Fiat"],
            datasets: [
                {
                    label: "Chart",
                    data: [...totals, user.balance],
                    backgroundColor: [
                        "Black",
                        "grey",
                        "silver",
                        "gainsboro",
                        "white smoke",
                        "white",
                        "slate gray",
                    ],
                    borderColor: "black",
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
                text: "Portfolio",
                fontSize: 18,
                fontColor: "black",
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "black",
                    fontSize: 16,
                },
            },
        };

        //create Chart class object
        chart = new Chart(ctx, {
            type: "doughnut",
            data: data,
            options: options,
        });
    }, [currencies, coinBalance, totals, user]);
    return (
        <div className="userStats">
            <div id="pieGraph" style={{ width: 500 }}>
                <canvas ref={canvas} id="myChart"></canvas>
            </div>
            <div id="userBalance">
                {coinBalance &&
                    coinBalance.map((coin) => (
                        <div className="grid-container" key={coin.currency}>
                            <img
                                src={
                                    coinImages &&
                                    coinImages.filter(
                                        (coinImage) =>
                                            (coinImage.name = coin.currency)
                                    ).url
                                }
                                style={{ width: 50, height: 50 }}
                            ></img>
                            &nbsp;&nbsp;
                            <strong>
                                Amount:
                                {new Intl.NumberFormat("de-DE", {
                                    style: "decimal",
                                    maximumFractionDigits: 2,
                                }).format(coin.sum)}
                            </strong>
                            &nbsp;&nbsp;
                            <strong>
                                Price:
                                {new Intl.NumberFormat("de-DE", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 2,
                                }).format(coin.price)}
                            </strong>
                            &nbsp;&nbsp;
                            <strong>
                                WORTH:
                                {new Intl.NumberFormat("de-DE", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 2,
                                }).format(coin.total)}
                            </strong>
                        </div>
                    ))}

                <div id="totalStat">
                    <strong>
                        Fiat:{" "}
                        {user &&
                            new Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                            }).format(user.balance)}
                    </strong>
                    <strong>
                        Crypto:{" "}
                        {new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                        }).format(totalSum)}
                    </strong>

                    <strong>
                        Total:{" "}
                        {new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                        }).format(totalSum + user.balance)}
                    </strong>
                </div>
            </div>
        </div>
    );
}
