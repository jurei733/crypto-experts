import React from "react";

import BioEditor from "./BioEditor.js";
import ProfilePic from "./ProfilePic";
import UserStats from "./UserStats";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bio: this.props.bio,
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            profilePic: this.props.profilePic,
        };
        this.updateBio = this.props.updateBio.bind(this);
    }

    render() {
        console.log(this.props.bio);

        return (
            <React.Fragment>
                <div className="profile">
                    <ProfilePic
                        toggleUploader={this.props.toggleUploader}
                        className="bigProfilePicture"
                        profilePic={this.props.profilePic}
                    />
                    <strong>
                        {this.props.firstname} {this.props.lastname}
                    </strong>
                    <BioEditor
                        updateBio={this.updateBio}
                        firstname={this.props.firstname}
                        lastname={this.props.lastname}
                        bio={this.props.bio}
                    />
                </div>
                <UserStats />
            </React.Fragment>
        );
    }
}
