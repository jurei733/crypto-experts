import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveCoins, receiveGlobalCoinData } from "./actions.js";
import { Link } from "react-router-dom";

export default function Coins() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveCoins());
        dispatch(receiveGlobalCoinData());
    }, [coins, global]);

    const coins = useSelector((store) => store.coins);
    const global = useSelector((store) => store.global);

    return (
        <div id="coinOverview">
            <div id="marketOverview">
                <p>
                    BTC-Dominance:
                    {global.market_cap_percentage &&
                        new Intl.NumberFormat("en-GB", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(global.market_cap_percentage.btc)}
                    %
                </p>
                <p
                    className={
                        global.price_change_percentage_24h > 0
                            ? " globalMarketCapPercentage green"
                            : " globalMarketCapPercentage red"
                    }
                >
                    {global.market_cap_change_percentage_24h_usd &&
                        new Intl.NumberFormat("en-GB", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(global.market_cap_change_percentage_24h_usd)}
                    (24h)
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
                    <p className="coinPrice">
                        {new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "USD",
                        }).format(coin.current_price)}
                    </p>
                    <p className="coinMarketCap">
                        {new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "USD",
                            maximumSignificantDigits: 6,
                        }).format(coin.market_cap)}
                    </p>
                    <p
                        className={
                            coin.price_change_percentage_24h > 0
                                ? "coinPriceChange green"
                                : "coinPriceChange red"
                        }
                    >
                        {new Intl.NumberFormat("de-DE", {
                            maximumFractionDigits: 2,
                        }).format(coin.price_change_percentage_24h)}
                    </p>
                    <p
                        className={
                            coin.market_cap_change_percentage_24h > 0
                                ? "coinPriceChange green"
                                : "coinPriceChange red"
                        }
                    >
                        {new Intl.NumberFormat("de-DE", {
                            maximumFractionDigits: 2,
                        }).format(coin.market_cap_change_percentage_24h)}
                    </p>
                </Link>
            ))}
        </div>
    );
}
