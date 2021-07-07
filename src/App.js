import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Logo from "./Logo.js";
import Profile from "./Profile";
import Coins from "./Coins";
import Coin from "./Coin";
import Ranking from "./Ranking";
import News from "./News";
import OtherProfile from "./OtherProfile";
import ProfilePic from "./ProfilePic";
import Chat from "./Chat";
import Friends from "./Friends";
import Uploader from "./Uploader";
import FindPeople from "./FindPeople";
import axios from "./axios.js";
import { socket } from "./socket.js";
import ResetError from "./ResetError.js";

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            activeUsers: undefined,
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
        this.getActiveUsers();
    }

    async getActiveUsers() {
        let { data } = await axios.get("/activeUsers");
        this.setState({
            activeUsers: data,
        });
    }

    getUser() {
        axios
            .get("/user", this.state)
            .then(({ data }) => {
                this.setState({
                    profilePic: data.image,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    bio: data.bio,
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
                <Router>
                    {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                    <div id="appHeader">
                        <Logo />
                        <Link to="/">
                            <img
                                style={{
                                    width: 75,
                                    height: 75,
                                }}
                                className="headerIcon"
                                src="/profile-icon.png"
                            ></img>
                        </Link>
                        <Link to="/news">
                            <img
                                className="headerIcon"
                                src="/news-icon.png"
                            ></img>
                        </Link>
                        <Link to="/coins">
                            <img
                                className="headerIcon"
                                src="/stats-icon.png"
                            ></img>
                        </Link>
                        <Link to="/ranking">
                            <img
                                style={{
                                    width: 75,
                                    height: 75,
                                }}
                                className="headerIcon"
                                src="/ranking-icon.png"
                            ></img>
                        </Link>
                        <Link to="/users">
                            <img
                                style={{
                                    borderRadius: "50%",
                                    width: 70,
                                    height: 70,
                                }}
                                className="headerIcon"
                                src="/search-icon.png"
                            ></img>
                        </Link>
                        <Link to="/friends">
                            <img
                                style={{
                                    borderRadius: "50%",
                                    width: 70,
                                    height: 70,
                                }}
                                className="headerIcon"
                                src="/friends-icon.png"
                            ></img>
                        </Link>
                        <Link to="/chat">
                            <img
                                style={{
                                    width: 75,
                                    height: 75,
                                }}
                                className="headerIcon"
                                src="/chat-icon.png"
                            ></img>
                        </Link>

                        <img
                            id="logout"
                            onClick={() => {
                                socket.close();
                                axios.get("/logout").then(() => {
                                    location.replace("/");
                                });
                            }}
                            style={{
                                borderRadius: "50%",
                                width: 70,
                                height: 70,
                            }}
                            className="headerIcon"
                            src="/logout-icon.png"
                        ></img>

                        <div>
                            <ProfilePic
                                profilePic={this.state.profilePic}
                                className="smallProfilePicture"
                                firstname={this.state.firstname}
                                lastname={this.state.lastname}
                                toggleUploader={this.toggleUploader}
                            />
                        </div>
                    </div>
                    {this.state.uploaderVisible && (
                        <Uploader
                            toggleUploader={this.toggleUploader}
                            uploadImage={this.uploadImage}
                        />
                    )}
                    <React.Fragment>
                        <div id="main">
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
                            <Route
                                path="/users"
                                render={() => <FindPeople />}
                            />
                            <Route path="/friends" render={() => <Friends />} />
                            <Route path="/coin/:name" component={Coin} />
                            <Route path="/chat" component={Chat} />
                            <Route path="/ranking" component={Ranking} />
                            <Route path="/news" component={News} />
                            <ResetError></ResetError>
                        </div>
                    </React.Fragment>
                </Router>
            </React.Fragment>
        );
    }
}
