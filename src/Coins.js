import React from "react";
import axios from "./axios.js";

export default class Coins extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
        };
    }

    async componentDidMount() {
        try {
            const { data } = await axios.get(`/api/coins`);
            console.log(data);
            this.setState({});
        } catch (e) {
            this.setState({
                error: true,
            });
        }
    }

    render() {
        return (
            <div>
                <p>Here should be all the coins.</p>
            </div>
        );
    }
}
