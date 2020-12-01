import React from "react";

import axios from "./axios.js";

export default class OtherProfile extends React.Component {
    constructor() {
        super();

        this.state = {
            bio: "",
            firstname: "",
            lastname: "",
            profilePic: undefined,
            error: false,
        };
    }

    async componentDidMount() {
        console.log("ID", this.props.match.params.id); // all kind of props injected by react-router-dom

        try {
            const { data } = await axios.get(
                `/api/user/${this.props.match.params.id}`
            );
            console.log(data[0].firstname);
            this.setState({
                firstname: data[0].firstname,
                lastname: data[0].lastname,
                bio: data[0].bio,
                profilePic: data[0].image,
            });
        } catch (e) {
            // tried to access own profile
            if (e.response.status === 418) {
                this.props.history.push("/");
            } else {
                this.setState({
                    error: true,
                });
            }
        }
    }

    render() {
        return (
            <div>
                {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                <img
                    className="bigProfilePicture"
                    src={this.state.profilePic}
                ></img>
                <h1>
                    {this.state.firstname} {this.state.lastname}
                </h1>

                <p>{this.state.bio}</p>
            </div>
        );
    }
}
