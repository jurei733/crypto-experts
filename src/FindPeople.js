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
            <React.Fragment>
                <h1>Find People!</h1>
                <input
                    type="search"
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <h2>Checkout who just joined!</h2>
                <div className="userOverview">
                    {users.map((user) => (
                        <div key={user.id}>
                            <img src={user.image} />
                            <Link className="link" to={`/user/${user.id}`}>
                                {user.firstname}
                                {user.lastname}
                            </Link>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <h1>Find People!</h1>
                <input
                    type="search"
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="userOverview">
                    {users.map((user) => (
                        <div key={user.id}>
                            <img src={user.image} />
                            <Link className="link" to={`/user/${user.id}`}>
                                {user.firstname}
                                {user.lastname}
                            </Link>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}
