import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveUserData, receiveCoinsBalance } from "./actions.js";

export default function UserStats() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(receiveUserData());
        dispatch(receiveCoinsBalance());
    }, []);

    const user = useSelector((store) => store.user);
    return (
        <div className="userStats">
            {user && console.log("UUUSER", user[0])}
            <p>Here come the UserStats</p>
        </div>
    );
}
