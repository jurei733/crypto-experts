import axios from "./axios";

export async function receiveUserData() {
    const { data } = await axios.get("/user");

    return {
        type: "RECEIVE_USER_DATA",
        user: data,
    };
}

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

export async function logout() {
    return {
        type: "LOGOUT",
    };
}

export async function receiveCoins() {
    let { data } = await axios.get("/api/coins");
    return {
        type: "RECEIVE_COINS",
        coins: data,
    };
}

export async function buyCoin(coinId, amount) {
    console.log("COIN ID", coinId);
    let { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    console.log("PRICE", data[coinId].usd);
    console.log("AMOUNT", amount);
    await axios.post(`/api/coin/buy/${coinId}`, {
        price: data[coinId].usd,
        amount,
    });
    return {
        type: "BUY_COIN",
    };
}

export async function sellCoin(coinId, amount) {
    let { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    console.log("PRICE", data[coinId].usd);
    await axios.post(`/api/coin/sell/${coinId}`, {
        price: data[coinId].usd,
        amount,
    });
    return {
        type: "SELL_COIN",
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
    let coin = await axios.get(`/api/coin/${id}`);
    let history = await axios.get(`/api/coin/history/${id}`);

    return {
        type: "RECEIVE_COIN_DATA",
        coin: coin.data,
        history: history.data.prices,
    };
}

export async function historyData(id) {
    const unixTime = Math.floor(Date.now() / 1000);
    let weekTime = unixTime - 604800;
    let { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${weekTime}&to=${unixTime}`
    );
    console.log("HISTORY DATA", data);
    return {
        type: "HISTORY_DATA",
        history: data.prices,
    };
}

export async function receiveCoinsBalance() {
    let { data } = await axios.get("/api/coins/balance");
    let currencies = data.map((coin) => coin.currency);
    let copyCurr = currencies;
    console.log("CURRENCIES", currencies);
    let stringAPI = "";
    currencies.forEach((element) => {
        stringAPI += element + "%2C";
    });
    console.log("STRING-API", stringAPI);
    let currenciesPrices = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${stringAPI}&vs_currencies=usd`
    );
    console.log("CurrenciesPrices", currenciesPrices);
    console.log("CurrenciesPrices", currenciesPrices.data.bitcoin);
    data.forEach(function (element, i) {
        console.log("INDEX", i);
        element.price = currenciesPrices.data[copyCurr[i]].usd;
        element.total = currenciesPrices.data[copyCurr[i]].usd * data[i].sum;
    });
    console.log("CurrenciesPrices", currenciesPrices);
    console.log("COIN BALANCE", data);
    let totals = data.map((el) => el.total);
    let totalSum = totals.reduce((a, b) => {
        return a + b;
    });

    return {
        type: "RECEIVE_COIN_BALANCE",
        coinBalance: data,
        currencies,
        totals,
        totalSum,
    };
}

export async function receiveRanking() {
    const { data } = await axios.get("/api/ranking");
    let currencies = [
        "bitcoin",
        "ethereum",
        "ripple",
        "tether",
        "litecoin",
        "bitcoin-cash",
        "chainlink",
        "cardano",
        "polkadot",
        "binancecoin",
    ];
    let stringAPI = "";
    currencies.forEach((element) => {
        stringAPI += element + "%2C";
    });
    let currenciesPrices = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${stringAPI}&vs_currencies=usd`
    );
    for (let i = 0; i < data.length; i++) {
        let coinTotal = 0;
        data[i].coinsBalance.forEach(function (element) {
            console.log("COIN NAME", element.currency);
            element.price = currenciesPrices.data[element.currency].usd;
            element.total =
                currenciesPrices.data[element.currency].usd * element.sum;
            coinTotal += element.total;
        });
        data[i].coinTotal = coinTotal;
        data[i].totalAmount = data[i].balance + coinTotal;
    }
    data.sort(function (a, b) {
        return b.totalAmount - a.totalAmount;
    });

    let totalAmounts = data.map((user) => user.totalAmount);
    console.log("Total Amounts", totalAmounts);
    console.log("RANKING DATA", data);

    return {
        type: "RECEIVE_RANKING",
        userRanking: data,
    };
}
