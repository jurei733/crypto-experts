import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { resetError, resetSucess } from "./actions.js";
export default function ResetError() {
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(() => {
        dispatch(resetError());
        dispatch(resetSucess());
        console.log("WORKS");
    }, [location.pathname]);
    return null;
}
