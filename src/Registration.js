import React from "react";
import axios from "./axios.js";

import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();

        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            error: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        axios
            .post("/register", this.state)
            .then(() => {
                location.replace("/");
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });

        console.log("FORM SUBMITTED", this.state);
    }

    handleChange(e) {
        console.log("handleChange", e.target.name, e.target.value);

        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render() {
        return (
            <div id="registration">
                <h2>Registration</h2>
                {this.state.error && (
                    <p className="red">Did not work. Please try again</p>
                )}
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    <input
                        type="text"
                        name="firstname"
                        onChange={this.handleChange}
                        value={this.state.firstname}
                        placeholder="Firstname"
                    />
                    <input
                        type="text"
                        name="lastname"
                        onChange={this.handleChange}
                        value={this.state.lastname}
                        placeholder="Lastname"
                    />
                    <input
                        type="email"
                        name="email"
                        onChange={this.handleChange}
                        value={this.state.email}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        value={this.state.password}
                        placeholder="Password"
                    />
                    <button className="btn" type="submit">
                        Create Account
                    </button>
                    <p>
                        Already a member?{" "}
                        <Link to="/login">
                            <u>Login</u>
                        </Link>
                    </p>
                </form>
            </div>
        );
    }
}
