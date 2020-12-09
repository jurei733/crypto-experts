import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveCoinData } from "./actions.js";
import Chart from "chart.js";
import { Link } from "react-router-dom";

export default function Coins(props) {
    const canvas = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveCoinData(props.match.params.name));
    }, [props.match.params.name]);

    const coin = useSelector((store) => store.coin);

    const coinDates = useSelector((store) =>
        store.history.map(
            (arr) =>
                new Date(arr[0]).getHours() +
                ":" +
                new Date(arr[0]).getMinutes()
        )
    );

    let date = new Date(coinDates[1]);

    console.log("DATE", date.getHours(), date.getMinutes());

    const coinPrices = useSelector((store) =>
        store.history.map((arr) => arr[1])
    );
    useEffect(() => {
        var ctx = canvas.current;
        //line chart data
        var data = {
            labels: coinDates,
            datasets: [
                {
                    label: "TeamA Score",
                    data: coinPrices,
                    backgroundColor: "blue",
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
            type: "line",
            data: data,
            options: options,
        });
    }, [coinDates, coinPrices]);

    console.log("COIN_Prices", coinPrices);
    console.log("COIN DATES", coinDates);
    console.log("COIN-DATA", coin);

    return (
        <React.Fragment>
            <button>Buy</button>
            <button>Sell</button>
            <canvas ref={canvas} id="myChart"></canvas>

            <p>Here should be one coin.</p>
        </React.Fragment>
    );
}
