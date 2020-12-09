import { connect } from "socket.io-client";

import { setChatMessages, sendMessage } from "./actions";

export let socket;

export function init(store) {
    socket = connect();
    socket.on("chatMessages", (msgs) => {
        console.log("chatMessages", msgs);
        store.dispatch(setChatMessages(msgs));
    });
    socket.on("chatMessage", (msg) => {
        console.log("chatMessage", msg);
        store.dispatch(sendMessage(msg));
    });
}
