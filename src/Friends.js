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

    console.log("Friends", friends);
    console.log("FriendRequester", friendRequester);

    return (
        <React.Fragment>
            <h2> This people want to be your friend </h2>
            <div>
                {friendRequester.map((friendReq) => (
                    <div className="userOverview" key={friendReq.id}>
                        <img src={friendReq.image} />
                        <Link className="link" to={`/user/${friendReq.id}`}>
                            {friendReq.firstname}
                            {friendReq.lastname}
                        </Link>
                        <div className="buttons">
                            <button
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
            <div>
                {friends.map((friend) => (
                    <div className="userOverview" key={friend.id}>
                        <img src={friend.image} />
                        <Link className="link" to={`/user/${friend.id}`}>
                            {friend.firstname}
                            {friend.lastname}
                        </Link>
                        <div className="buttons">
                            <button
                                onClick={() => dispatch(unfriend(friend.id))}
                            >
                                End Friendship
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}
