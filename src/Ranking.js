import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveRanking } from "./actions.js";
import { Link } from "react-router-dom";

export default function Ranking() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveRanking());
    }, [ranking]);
    let ranking = useSelector((store) => store.userRanking);

    return (
        <div className="ranking">
            {ranking &&
                ranking.map((user) => (
                    <Link key={user.id} to={`/user/${user.id}`}>
                        <div className="rankingUser">
                            <img src={user.image}></img>
                            {user.firstname}&nbsp;&nbsp;
                            {user.lastname}&nbsp;&nbsp;
                            {new Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "USD",
                            }).format(user.totalAmount)}
                            &nbsp;&nbsp;
                        </div>
                    </Link>
                ))}
        </div>
    );
}
