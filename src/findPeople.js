import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUser] = useState();
    const [val, setValue] = useState();
    console.log("val", val);

    useEffect(
        () => {
            if (!val) {
                (async () => {
                    try {
                        const { data } = await axios.get("/users.json");
                        // console.log("data", data);
                        setUser(data);
                    } catch (err) {
                        console.log("err in GET /users", err);
                    }
                })();
            } else {
                (async () => {
                    try {
                        const { data } = await axios.get(`/search/${val}.json`);
                        console.log("data", data);
                        setUser(data);
                    } catch (err) {
                        console.log("err in GET /users", err);
                    }
                })();
            }
        },
        [val]
    );

    return (
        <div>
            {!val ? <p>Checkout who just joined!</p> : <p>Find people</p>}
            <input
                name="finder"
                placeholder="find people"
                onChange={e => setValue(e.target.value)}
            />
            {users &&
                users.map(user => (
                    <div key={user.id}>
                        <Link to={`/user/${user.id}`}>
                            <img
                                className="other-avatar"
                                src={user.image}
                                alt={`${user.first} ${user.last}`}
                            />
                            <h2>
                                {user.first} {user.last}
                            </h2>
                        </Link>
                    </div>
                ))}
        </div>
    );
}
