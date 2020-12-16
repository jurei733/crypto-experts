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
export async function receiveNews() {
    let { data } = await axios.get("/api/news");
    return {
        type: "RECEIVE_NEWS",
        news: data,
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
    let error = false;
    try {
        let { data } = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
        );
        await axios.post(`/api/coin/sell/${coinId}`, {
            price: data[coinId].usd,
            amount,
        });
        console.log("PRICE", data[coinId].usd, "AMOUNT", amount);
    } catch (e) {
        console.log("Error", e);
        error = true;
    }
    return {
        type: "SELL_COIN",
        error,
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
    let totals = data.map((el) => Math.round(el.total));

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

export async function historyData(id, timespan) {
    const unixTime = Math.floor(Date.now() / 1000);
    let data = [];
    if (timespan == "one_week") {
        let weekTime = unixTime - 604800;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${weekTime}&to=${unixTime}`
        );
    } else if (timespan == "one_hour") {
        let oneHour = unixTime - 3600;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${oneHour}&to=${unixTime}`
        );
    } else if (timespan == "twelve_hours") {
        let twelveHours = unixTime - 43200;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${twelveHours}&to=${unixTime}`
        );
    } else if (timespan == "one_day") {
        let oneDay = unixTime - 86400;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${oneDay}&to=${unixTime}`
        );
    } else if (timespan == "three_days") {
        let threeDays = unixTime - 259200;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${threeDays}&to=${unixTime}`
        );
    } else if (timespan == "one_week") {
        let oneWeek = unixTime - 604800;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${oneWeek}&to=${unixTime}`
        );
    } else if (timespan == "one_month") {
        let oneMonth = unixTime - 2628000;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${oneMonth}&to=${unixTime}`
        );
    } else if (timespan == "three_months") {
        let threeMonths = unixTime - 7884000;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${threeMonths}&to=${unixTime}`
        );
    } else if (timespan == "six_months") {
        let sixMonths = unixTime - 15768000;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${sixMonths}&to=${unixTime}`
        );
    } else if (timespan == "one_year") {
        let oneYear = unixTime - 31536000;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${oneYear}&to=${unixTime}`
        );
    } else if (timespan == "three_years") {
        let threeYears = unixTime - 94608000;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${threeYears}&to=${unixTime}`
        );
    } else if (timespan == "max") {
        let max = unixTime - 315360000;
        data = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${max}&to=${unixTime}`
        );
    }

    console.log("HISTORY DATA", data);
    return {
        type: "HISTORY_DATA",
        history: data.data.prices,
    };
}
