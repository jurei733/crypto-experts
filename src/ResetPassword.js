import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios.js";

export default class ResetPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            step: 0,
            email: "",
            error: false,
            code: "",
        };
        this.verifyCode = this.verifyCode.bind(this);
        this.sendCode = this.sendCode.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    sendCode(e) {
        e.preventDefault();

        axios
            .post("/password/reset/start", this.state)
            .then(() => {
                this.setState({
                    error: false,
                    step: 1,
                });
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });

        console.log("LOGIN FORM SUBMITTED", this.state);
    }

    verifyCode(e) {
        e.preventDefault();

        axios
            .post("/password/reset/verify", this.state)
            .then(() => {
                this.setState({
                    error: false,
                    step: 2,
                });
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });

        console.log("LOGIN FORM SUBMITTED", this.state);
    }

    handleChange(e) {
        console.log("handleChange", e.target.name, e.target.value);

        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    render() {
        if (this.state.step === 0) {
            return (
                <React.Fragment>
                    {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                    <h1>Give us your E-Mail to refresh your memory</h1>
                    <form onSubmit={this.sendCode}>
                        <input
                            type="email"
                            name="email"
                            placeholder="email"
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
                        <button className="btn" type="submit">
                            Reset Password
                        </button>
                    </form>
                </React.Fragment>
            );
        } else if (this.state.step === 1) {
            return (
                <React.Fragment>
                    {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                    <h1>
                        Give us your Auth Code that weve sent to your email and
                        also your new password, but probably you are going to
                        forget it again.
                    </h1>
                    <form onSubmit={this.verifyCode}>
                        <input
                            type="text"
                            name="code"
                            placeholder="Code"
                            onChange={this.handleChange}
                            value={this.state.code}
                        />
                        <input
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                        />
                        <button className="btn" type="submit">
                            Verify Password
                        </button>
                    </form>
                </React.Fragment>
            );
        } else {
            return (
                <h1>
                    Successful, go to <Link to="/login">Login</Link>
                </h1>
            );
        }
    }
}
