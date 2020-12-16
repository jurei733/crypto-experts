import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveCoinData, buyCoin, sellCoin, historyData } from "./actions.js";
import Chart from "chart.js";
import axios from "./axios";
import { Link } from "react-router-dom";

let chart = null;

export default function Coins(props) {
    const canvas = useRef();
    const sellAmount = useRef();
    const buyAmount = useRef();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);

    useEffect(() => {
        dispatch(receiveCoinData(props.match.params.name));
    }, [props.match.params.name]);

    const coin = useSelector((store) => store.coin);

    const coinDates = useSelector((store) =>
        store.history.map((arr) => new Date(arr[0]))
    ); /*.map(
            (arr) =>
                new Date(arr[0]).getHours() +
                ":" +
                new Date(arr[0]).getMinutes()
        
    );*/

    const coinPrices = useSelector((store) =>
        store.history.map((arr) => arr[1])
    );
    useEffect(() => {
        if (chart) chart.destroy();
        var ctx = canvas.current;
        //line chart data
        var data = {
            labels: coinDates,
            datasets: [
                {
                    label: "Chart",
                    data: coinPrices,
                    backgroundColor: "blue",
                    borderColor: "black",
                    fill: false,
                    lineTension: 0,
                    radius: 1,
                },
            ],
        };

        //options
        var options = {
            tooltips: {
                // Disable the on-canvas tooltip
                enabled: false,
            },
            responsive: true,
            scales: {
                xAxes: [
                    {
                        ticks: {
                            fontColor: "black",
                            fontSize: 20,
                        },
                        scaleLabel: {
                            display: true,
                            fontColor: "black",
                            fontSize: 20,
                        },
                        gridLines: {
                            display: false,
                        },
                        type: "time",
                        distribution: "linear",
                        time: {
                            minUnit: "minute",
                            round: "minute",
                        },
                    },
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            fontColor: "black",
                        },
                        ticks: {
                            fontColor: "black",
                            fontSize: 20,

                            // Include a dollar sign in the ticks
                            callback: function (value) {
                                return value + "$";
                            },
                        },
                    },
                ],
            },
            title: {
                display: false,
                position: "top",
                text: "",
                fontSize: 18,
                fontColor: "#111",
            },
            legend: {
                display: false,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16,
                },
            },
        };

        //create Chart class object
        chart = new Chart(ctx, {
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
            <img src={coin && coin.image.small} />
            <div id="coinTitle">
                {coin && coin.name}
                {coin &&
                    new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "USD",
                    }).format(coin.market_data.current_price.usd)}
                <input ref={buyAmount} name="buy" type="number"></input>
                <button
                    className="coinBtn"
                    onClick={() =>
                        dispatch(buyCoin(coin.id, buyAmount.current.value))
                    }
                >
                    Buy
                </button>
                <input ref={sellAmount} name="sell" type="number"></input>
                <button
                    className="coinBtn"
                    onClick={() =>
                        dispatch(sellCoin(coin.id, sellAmount.current.value))
                    }
                >
                    Sell
                </button>
                <button
                    className="coinBtn"
                    style={{ display: "inline" }}
                    onClick={() => setModal(!modal)}
                >
                    Description
                </button>
            </div>

            {modal && (
                <div>
                    <p
                        id="coinDescription"
                        dangerouslySetInnerHTML={{
                            __html: coin.description.de,
                        }}
                    ></p>
                </div>
            )}
            <div style={{ width: "90vw" }}>
                <canvas ref={canvas} id="myChart"></canvas>
            </div>
            <div id="historyChanges">
                <button
                    className="btnhistoryChanges"
                    onClick={() => dispatch(historyData(coin.id, "one_hour"))}
                >
                    1h
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() =>
                        dispatch(historyData(coin.id, "twelve_hours"))
                    }
                >
                    12h
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() => dispatch(historyData(coin.id, "one_day"))}
                >
                    1d
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() => dispatch(historyData(coin.id, "three_days"))}
                >
                    3d
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() => dispatch(historyData(coin.id, "one_week"))}
                >
                    1W
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() => dispatch(historyData(coin.id, "one_month"))}
                >
                    1M
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() =>
                        dispatch(historyData(coin.id, "three_months"))
                    }
                >
                    3M
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() => dispatch(historyData(coin.id, "six_months"))}
                >
                    6M
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() => dispatch(historyData(coin.id, "one_year"))}
                >
                    1Y
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() =>
                        dispatch(historyData(coin.id, "three_years"))
                    }
                >
                    3Y
                </button>
                <button
                    className="btnhistoryChanges"
                    onClick={() => dispatch(historyData(coin.id, "max"))}
                >
                    MAX
                </button>
            </div>
        </React.Fragment>
    );
}
