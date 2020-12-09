import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Logo from "./Logo.js";
import Profile from "./Profile";
import Coins from "./Coins";
import Coin from "./Coin";
import OtherProfile from "./OtherProfile";
import ProfilePic from "./ProfilePic";
import Chat from "./Chat";
import Friends from "./Friends";
import Uploader from "./Uploader";
import FindPeople from "./FindPeople";
import { Link } from "react-router-dom";
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
        this.getUser = this.getUser.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
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

    updateBio(bio) {
        this.setState({
            bio: bio,
        });
    }

    render() {
        if (!this.state.email) return null;
        return (
            <React.Fragment>
                <BrowserRouter>
                    {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                    <div id="appHeader">
                        <Logo />

                        <Link to="/coins">
                            <img
                                className="headerIcon"
                                src="/stats-icon.png"
                            ></img>
                        </Link>
                        <Link to="/users">
                            <img
                                className="headerIcon"
                                src="/search-icon.png"
                            ></img>
                        </Link>
                        <Link to="/friends">
                            <img
                                className="headerIcon"
                                src="/friends-icon.png"
                            ></img>
                        </Link>
                        <Link to="/chat">
                            <img
                                className="headerIcon"
                                src="/chat-icon.png"
                            ></img>
                        </Link>

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
                    <React.Fragment>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <div id="appProfile">
                                    <Profile
                                        bio={this.state.bio}
                                        updateBio={this.updateBio}
                                        toggleUploader={this.toggleUploader}
                                        profilePic={this.state.profilePic}
                                        firstname={this.state.firstname}
                                        lastname={this.state.lastname}
                                    />
                                </div>
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/coins" render={() => <Coins />} />
                        <Route path="/users" render={() => <FindPeople />} />
                        <Route path="/friends" render={() => <Friends />} />
                        <Route path="/coin/:name" component={Coin} />
                        <Route path="/chat" component={Chat} />
                    </React.Fragment>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}
