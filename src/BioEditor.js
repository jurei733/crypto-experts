import React from "react";
import axios from "./axios.js";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bio: this.props.bio,
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            editing: false,
        };

        this.toggleEditing = this.toggleEditing.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing,
        });
    }

    saveEdit() {
        axios
            .post("/update/profile", {
                bio: document.querySelector("textarea").value,
            })
            .then(() => {
                this.setState({
                    bio: document.querySelector("textarea").value,
                    editing: !this.state.editing,
                });
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        if (this.state.error) return <p>DIDNT WORK, TOO BAD</p>;
        let name = this.state.firstname + this.state.lastname;

        if (!this.state.editing) {
            if (!this.state.bio) {
                return (
                    <div>
                        <h1>{name}</h1>
                        <button onClick={this.toggleEditing} className="btn">
                            Add your Bio now
                        </button>
                    </div>
                );
            }

            return (
                <div>
                    <h1>{name}</h1>
                    <p id="bioContent">{this.state.bio}</p>
                    <button onClick={this.toggleEditing} className="btn">
                        Edit
                    </button>
                </div>
            );
        }
        return (
            <div>
                <h1>{name}</h1>
                <textarea defaultValue={this.state.bio}></textarea>
                <button onClick={this.saveEdit} className="btn">
                    Save
                </button>
            </div>
        );
    }
}
