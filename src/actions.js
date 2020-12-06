import axios from "./axios";

export async function receiveFriendsWannabes() {
    let { data } = await axios.get("/friends-wannabes");
    console.log("MY DATA from friends Wannabe req", data.rows);
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
    await axios.get(`/end-friendship/${id}`);

    return {
        type: "UNFRIEND",
        id,
    };
}
