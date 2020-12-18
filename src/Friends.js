import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsWannabes, acceptFriend, unfriend } from "./actions.js";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    const friends = useSelector(
        (store) =>
            store.friendsWannabes &&
            store.friendsWannabes.filter((friend) => friend.accepted == true)
    );
    const friendRequester = useSelector(
        (store) =>
            store.friendsWannabes &&
            store.friendsWannabes.filter((friend) => friend.accepted == false)
    );

    console.log("Friends", friends, friends.length);
    console.log("FriendRequester", friendRequester);

    if (!friends.length && !friendRequester.length)
        return (
            <div id="noFriends">
                <h2>No Friends or Friend Request yet. Search our community </h2>
                <Link className="link" to={`/users`}>
                    <img src="/find-friends-icon.png"></img>
                </Link>
            </div>
        );

    return (
        <div id="friendContainer">
            <h2> This people want to be your friend </h2>
            <div id="wannabeFriends">
                {friendRequester.map((friendReq) => (
                    <div className="friend" key={friendReq.id}>
                        <img
                            style={{
                                objectFit: "fill",
                                margin: "10px",
                            }}
                            className="bigProfilePicture"
                            src={friendReq.image}
                        />
                        <Link
                            style={{
                                fontSize: 25,
                                fontWeight: "bold",
                                color: "black",
                            }}
                            to={`/user/${friendReq.id}`}
                        >
                            {friendReq.firstname}
                            {friendReq.lastname}
                        </Link>
                        <div className="buttons">
                            <button
                                className="coinBtn"
                                onClick={() =>
                                    dispatch(acceptFriend(friendReq.id))
                                }
                            >
                                Accept Friend Request
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <h2> This people are currently your friends </h2>
            <div id="friends">
                {friends.map((friend) => (
                    <div className="friend" key={friend.id}>
                        <img
                            style={{
                                objectFit: "fill",
                                margin: "10px",
                            }}
                            className="bigProfilePicture"
                            src={friend.image}
                        />
                        <Link
                            style={{
                                fontSize: 25,
                                fontWeight: "bold",
                                color: "black",
                            }}
                            to={`/user/${friend.id}`}
                        >
                            {friend.firstname}
                            {friend.lastname}
                        </Link>
                        <div className="buttons">
                            <button
                                className="coinBtn"
                                onClick={() => dispatch(unfriend(friend.id))}
                            >
                                End Friendship
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
