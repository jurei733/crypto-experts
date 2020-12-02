import React, { useState, useEffect } from "react";
import axios from "./axios.js";

export default function FriendButton(props) {
    const [state, setState] = useState({
        buttonText: "",
    });

    useEffect(() => {
        console.log(state.buttonText);
        axios.get(`/statusFriendship/${props.id}`).then(({ data }) => {
            console.log(data);
            setState({ buttonText: data });
        });
    }, [props.id]);

    async function changeButton() {
        console.log(state.buttonText);
        if (state.buttonText == "Send Friend Request") {
            await axios.post(`/send-friend-request/${props.id}`);
            setState({ buttonText: "Cancel Friend Request" });
        }
        if (state.buttonText === "Cancel Friend Request") {
            await axios.post(`/end-friendship/${props.id}`);
            setState({ buttonText: "Send Friend Request" });
        }

        if (state.buttonText === "Accept Friend Request") {
            await axios.post(`/accept-friend-request/${props.id}`);
            setState({ buttonText: "Unfriend" });
        }
        if (state.buttonText === "Unfriend") {
            await axios.post(`/end-friendship/${props.id}`);
            setState({ buttonText: "Send Friend Request" });
        }
    }

    return (
        <React.Fragment>
            <button
                onClick={(e) => changeButton(e.target.value)}
                className="btn"
            >
                {state.buttonText}
            </button>
        </React.Fragment>
    );
}
