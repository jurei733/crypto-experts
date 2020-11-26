import React from "react";

import Logo from "./Logo.js";
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
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    componentDidMount() {
        //console.log("APP DID MOUNT");
        axios
            .get("/user", this.state)
            .then(({ data }) => {
                //console.log("DATA FROM MY AXIOS REQUEST", data);
                //console.log(data[0].image, data[0].firstname, "hhh");
                this.setState({
                    profilePic: data[0].image,
                    firstname: data[0].firstname,
                    lastname: data[0].lastname,
                    email: data[0].email,
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
        console.log(imgURL);
        this.setState({
            profilePic: imgURL,
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                <div id="appHeader">
                    <Logo />
                    <ProfilePic
                        profilePic={this.state.profilePic}
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
            </React.Fragment>
        );
    }
}
