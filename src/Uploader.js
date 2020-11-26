import React from "react";
import axios from "./axios.js";

export default class Uploader extends React.Component {
    constructor() {
        super();

        this.state = {
            image: null,
            file: "",
            error: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", this.state.file);
        //console.log("HANDLE-SUBMIT RUNS");
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("DATA BACK FROM POST AXIOS UPLOAD", data);

                this.setState({
                    error: false,
                    image: data.image,
                });
                this.props.uploadImage(data.image);
                this.props.toggleUploader();
            })
            .catch((e) => {
                console.log("EROROOROROR", e);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div id="dark">
                <div className="modal">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            onChange={this.handleChange}
                            type="file"
                            name="file"
                            //onClick={this.handleChange}
                        />
                        <button className="btn" type="submit">
                            Upload
                        </button>
                        {this.state.error && <p>DIDNT WORK, TOO BAD, BYE.</p>}
                    </form>
                </div>
            </div>
        );
    }
}
