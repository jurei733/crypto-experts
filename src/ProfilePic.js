import React from "react";

export default function ProfilePic(props) {
    //console.log("PROFILE PICS PROPS", props);
    if (props.profilePic) {
        return (
            <img
                id="profilePic"
                onClick={props.toggleUploader}
                src={props.profilePic}
                alt={`${props.firstname} ${props.lastname}`}
            />
        );
    } else {
        return (
            <img
                id="profilePic"
                onClick={props.toggleUploader}
                src="noProfilePicture.png"
            />
        );
    }
}
