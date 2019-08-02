import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriends, accept, unfriend } from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const wannabes = useSelector(
        state => state.friends && state.friends.filter(i => i.accepted == false)
    );
    const friends = useSelector(
        state => state.friends && state.friends.filter(i => i.accepted == true)
    );
    console.log("wannabes", wannabes);
    console.log("friends", friends);

    useEffect(() => {
        dispatch(getFriends());
    }, []);

    if (!wannabes) {
        return null;
    }
    return (
        <div>
            <div id="wannabes">
                <p>These people want to be your friends</p>
                {wannabes &&
                    wannabes.map(friend => (
                        <div key={friend.id}>
                            <Link to={`/user/${friend.id}`}>
                                <img
                                    className="other-avatar"
                                    src={friend.image}
                                    alt={`${friend.first} ${friend.last}`}
                                />
                                <h2>
                                    {friend.first} {friend.last}
                                </h2>
                            </Link>
                            <button onClick={e => dispatch(accept(friend.id))}>
                                Accept friend request
                            </button>
                        </div>
                    ))}
            </div>
            <div id="current-friends">
                <p>These people are currently your friends</p>
                {friends &&
                    friends.map(friend => (
                        <div key={friend.id}>
                            <Link to={`/user/${friend.id}`}>
                                <img
                                    className="other-avatar"
                                    src={friend.image}
                                    alt={`${friend.first} ${friend.last}`}
                                />
                                <h2>
                                    {friend.first} {friend.last}
                                </h2>
                            </Link>
                            <button
                                onClick={e => dispatch(unfriend(friend.id))}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
} //closes Friends function

//
