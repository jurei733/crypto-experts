import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "./axios";

export default function IncrementalSearch() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (query) setSearched(true);

        let stale = false;

        axios.get(`/api/users/?q=${query}`).then(({ data }) => {
            if (!stale) {
                setUsers(data);
            }
            console.log("USERS BASES ON QUERY", data);
        });

        //cleanup
        return () => {
            stale = true;
        };
    }, [query]);

    useEffect(() => {
        axios.get(`/api/users`).then(({ data }) => {
            console.log("RECENT USERS", data);
            setUsers(data);
        });
    }, []);

    if (!searched) {
        return (
            <div id="findPeople">
                <h1>Find Members!</h1>
                <input
                    style={{ fontSize: 40 }}
                    type="search"
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <h2>Checkout who just joined!</h2>

                <div className="userOverview">
                    {users.map((user) => (
                        <Link key={user.id} to={`/user/${user.id}`}>
                            <div>
                                <img
                                    style={{ objectFit: "fill" }}
                                    className="bigProfilePicture"
                                    src={user.image}
                                />
                                <span
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        color: "black",
                                    }}
                                >
                                    {user.firstname}
                                    {user.lastname}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <div id="findPeople">
                    <h1>Find People!</h1>
                    <input
                        style={{ fontSize: 40 }}
                        type="search"
                        name="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="userOverview">
                        {users.map((user) => (
                            <Link key={user.id} to={`/user/${user.id}`}>
                                <div className="findUser">
                                    <img
                                        style={{
                                            objectFit: "fill",
                                            margin: "10px",
                                        }}
                                        className="bigProfilePicture"
                                        src={user.image}
                                    />
                                    <span
                                        style={{
                                            fontSize: 25,
                                            fontWeight: "bold",
                                            color: "black",
                                        }}
                                    >
                                        {user.firstname}
                                        {user.lastname}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
