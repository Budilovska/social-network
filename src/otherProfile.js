import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        try {
            const id = this.props.match.params.id;
            const { data } = await axios.get(`/user/${id}.json`);
            console.log("data", data);
            if (data.sameUser) {
                this.props.history.push("/");
            } else if (data.noUser) {
                this.setState({
                    noUser: true
                });
            } else {
                this.setState({
                    first: data.first,
                    last: data.last,
                    bio: data.bio,
                    image: data.image
                });
            }
        } catch (err) {
            console.log("err in GET /user/id", err);
        }
    }

    render() {
        return (
            <div>
                {!this.state.noUser ? (
                    <div>
                        <img
                            className="other-avatar"
                            src={this.state.image}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                        <h2>
                            {this.state.first} {this.state.last}
                        </h2>
                        <p>{this.state.bio}</p>
                    </div>
                ) : (
                    <div className="404">
                        <img src="/404.png" />
                    </div>
                )}
            </div>
        );
    }
}
