import axios from "./axios";

export async function receiveFriendsWannabes() {
    let { data } = await axios.get("/friends-wannabes");
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsList: data.rows,
    };
}

export async function acceptFriend(id) {
    await axios.post(`/accept-friend-request/${id}`);

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id,
    };
}

export async function unfriend(id) {
    console.log("RIGHT WAY ID", id);
    await axios.post(`/end-friendship/${id}`);

    return {
        type: "UNFRIEND",
        id,
    };
}

export async function setChatMessages(chatMessages) {
    return {
        type: "CHAT_MESSAGES",
        chatMessages,
    };
}

export async function sendMessage(chatMessage) {
    return {
        type: "SEND_MESSAGE",
        chatMessage,
    };
}

export async function receiveCoins() {
    let { data } = await axios.get("/api/coins");
    return {
        type: "RECEIVE_COINS",
        coins: data,
    };
}

export async function buyCoin() {
    let { data } = await axios.get("/api/coins");
    return {
        type: "BUY_COIN",
        coins: data,
    };
}

export async function sellCoin() {
    let { data } = await axios.get("/api/coins");
    return {
        type: "SELL_COIN",
        coins: data,
    };
}

export async function receiveGlobalCoinData() {
    let { data } = await axios.get("/api/coins/global");
    console.log("GLOBAL DATA", data.data);
    return {
        type: "RECEIVE_GLOBAL_COIN_DATA",
        global: data.data,
    };
}

export async function receiveCoinData(id) {
    let { data } = await axios.get(`/api/coin/${id}`);
    let history = await axios.get(`/api/coin/history/${id}`);
    console.log("HISTORY DATA", history.data);
    console.log("GLOBAL DATA", data.data);
    return {
        type: "RECEIVE_COIN_DATA",
        coin: data,
        history: history.data.prices,
    };
}
