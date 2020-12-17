export default function (
    state = {
        chatMessages: [],
        friendsWannabes: [],
        coins: [],
        global: [],
        history: [],
        user: {},
        weekHistory: [],
        currencies: [],
        totals: [],
        totalSum: null,
        news: [],
        coinImages: [],
        error: false,
    },
    action
) {
    console.log(action);

    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = { ...state, friendsWannabes: action.friendsList };
    } else if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((wannabe) => {
                if (wannabe.id !== action.id) {
                    return wannabe;
                } else {
                    return {
                        ...wannabe,
                        accepted: true,
                    };
                }
            }),
        };
    } else if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter((wannabe) => {
                if (wannabe.id !== action.id) {
                    return true;
                } else {
                    return false;
                }
            }),
        };
    } else if (action.type == "CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages,
        };
    } else if (action.type == "SEND_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessage],
        };
    } else if (action.type == "RECEIVE_COINS") {
        state = {
            ...state,
            coins: action.coins,
        };
    } else if (action.type == "RECEIVE_GLOBAL_COIN_DATA") {
        state = {
            ...state,
            global: action.global,
        };
    } else if (action.type == "RECEIVE_COIN_DATA") {
        state = {
            ...state,
            coin: action.coin,
            history: action.history,
            weekHistory: action.weekHistory,
        };
    } else if (action.type == "RECEIVE_USER_DATA") {
        state = {
            ...state,
            user: action.user,
        };
    } else if (action.type == "RECEIVE_COIN_BALANCE") {
        state = {
            ...state,
            coinBalance: action.coinBalance,
            currencies: action.currencies,
            totals: action.totals,
            totalSum: action.totalSum,
        };
    } else if (action.type == "RECEIVE_RANKING") {
        state = {
            ...state,
            userRanking: action.userRanking,
        };
    } else if (action.type == "HISTORY_DATA") {
        state = {
            ...state,
            history: action.history,
        };
    } else if (action.type == "SELL_COIN") {
        state = {
            ...state,
            error: action.error,
        };
    } else if (action.type == "RECEIVE_NEWS") {
        state = {
            ...state,
            news: action.news,
        };
    } else if (action.type == "BUY_COIN") {
        state = {
            ...state,
            error: action.error,
        };
    }

    return state;
}
