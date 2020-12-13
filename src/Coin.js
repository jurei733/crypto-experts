import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveCoinData, buyCoin, sellCoin } from "./actions.js";
import Chart from "chart.js";
import axios from "./axios";
import { Link } from "react-router-dom";

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
                    label: "Chart",
                    data: coinPrices,
                    backgroundColor: "blue",
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
            <div id="coinTitle">
                <img src={coin && coin.image.small} />
                <h1>{coin && coin.name}</h1>
                <h2>{coin && coin.symbol.toUpperCase()}</h2>
            </div>
            <button
                onClick={() =>
                    dispatch(buyCoin(coin.id, buyAmount.current.value))
                }
            >
                Buy
            </button>
            <input ref={buyAmount} name="buy" type="number"></input>
            <button
                onClick={() =>
                    dispatch(sellCoin(coin.id, sellAmount.current.value))
                }
            >
                Sell
            </button>
            <input ref={sellAmount} name="sell" type="number"></input>

            <canvas ref={canvas} id="myChart"></canvas>
            {modal && (
                <div>
                    <p> This is what you want to buy/sell? </p>

                    <button onClick={() => setModal(false)}>NO </button>
                    <button onClick={() => addOrderbook()}>YES</button>
                </div>
            )}
        </React.Fragment>
    );
}
