import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveCoins, receiveGlobalCoinData } from "./actions.js";
import { Link } from "react-router-dom";

export default function Coins() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveCoins());
        dispatch(receiveGlobalCoinData());
    }, []);

    const coins = useSelector((store) => store.coins);
    const global = useSelector((store) => store.global);

    const logCoins = () => {
        for (let i = 0; i < 10; i++) {
            console.log(coins[i]);
        }
    };

    const britishNumberFormatter = new Intl.NumberFormat("en-GB", {
        minimumFractionDigits: 2,
    });

    return (
        <div id="coinOverview">
            <div id="marketOverview">
                <p>
                    BTC-Dominance:
                    {global.market_cap_percentage &&
                        britishNumberFormatter.format(
                            global.market_cap_percentage.btc
                        )}
                </p>
            </div>

            {coins.map((coin) => (
                <Link to={`/coin/${coin.id}`} className="coin" key={coin.id}>
                    <p className="coinRank">{coin.market_cap_rank}</p>
                    <img src={coin.image} />
                    <div className="coinNaming">
                        <p>{coin.symbol.toUpperCase()}</p>
                        <p>{coin.name}</p>
                    </div>
                    <p className="coinPrice">{coin.current_price}</p>
                    <p className="coinMarketCap">{coin.market_cap}</p>
                    <p className="coinMarketCapChange green">
                        {coin.price_change_percentage_24h}▲
                    </p>
                    <p className="coinPriceChange">
                        {coin.market_cap_change_percentage_24h}▼
                    </p>
                </Link>
            ))}
            <button onClick={() => logCoins()}>SHOW COINS</button>

            <p>Here should be all the coins.</p>
        </div>
    );
}
