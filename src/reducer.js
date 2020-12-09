export default function (
    state = {
        chatMessages: [],
        friendsWannabes: [],
        coins: [],
        global: [],
        history: [],
    },
    action
) {
    console.log(action);
    console.log("FRIENDS WANNABES REDUCER", action.friendsList);
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
        };
    }

    return state;
}
