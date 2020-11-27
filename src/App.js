import React from "react";

import Logo from "./Logo.js";
import Profile from "./Profile";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import axios from "./axios.js";

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            profilePic: undefined,
            uploaderVisible: false,
            error: false,
            firstname: "",
            lastname: "",
            email: "",
            bio: "",
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user", this.state)
            .then(({ data }) => {
                this.setState({
                    profilePic: data[0].image,
                    firstname: data[0].firstname,
                    lastname: data[0].lastname,
                    email: data[0].email,
                    bio: data[0].bio,
                });
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    uploadImage(imgURL) {
        this.setState({
            profilePic: imgURL,
        });
    }

    render() {
        if (!this.state.email) return null;
        return (
            <React.Fragment>
                {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                <div id="appHeader">
                    <Logo />
                    <ProfilePic
                        profilePic={this.state.profilePic}
                        className="smallProfilePicture"
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        toggleUploader={this.toggleUploader}
                    />
                </div>
                {this.state.uploaderVisible && (
                    <Uploader
                        toggleUploader={this.toggleUploader}
                        uploadImage={this.uploadImage}
                    />
                )}
                <div id="appProfile">
                    <Profile
                        toggleUploader={this.toggleUploader}
                        profilePic={this.state.profilePic}
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        bio={this.state.bio}
                    />
                </div>
            </React.Fragment>
        );
    }
}
