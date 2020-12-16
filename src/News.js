import React, { useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { receiveNews } from "./actions.js";

export default function News() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(receiveNews());
    }, []);

    const news = useSelector((store) => store.news);

    return (
        <div className="news-container">
            {news &&
                news.map((news) => (
                    <a
                        href={news.url}
                        target="blank"
                        className="news"
                        key={news._id}
                    >
                        <img
                            src={news.originalImageUrl}
                            style={{ height: "100%" }}
                        />
                        <div>
                            <strong>
                                <a href={news.url}>{news.title}</a>
                            </strong>
                            <p>{news.description}</p>
                            <p style={{ fontStyle: "italic" }}>
                                {news.source.name}
                                {"   "}
                                {new Date(
                                    news.publishedAt
                                ).toLocaleTimeString()}
                                {", "}
                                {new Date(
                                    news.publishedAt
                                ).toLocaleDateString()}
                            </p>
                            <p>
                                {news &&
                                    news.coins.map((coin) => coin.name + ", ")}
                            </p>
                        </div>
                    </a>
                ))}
            ;
        </div>
    );
}
