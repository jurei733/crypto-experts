export default function (state = { friendsWannabes: [] }, action) {
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
    }

    return state;
}
