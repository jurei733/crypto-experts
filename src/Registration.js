import React from "react";
import axios from "axios";

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
                <img id="bigLogo" src="logo.png"></img>
                <h2>the greatest community of trusted Cryto experts</h2>
                {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                <form onSubmit={this.handleSubmit}>
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
                        Already a member? <a href="">Log in</a>
                    </p>
                </form>
            </div>
        );
    }
}
