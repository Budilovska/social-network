import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        };
    }

    //------------------- getting textarea value ------------------
    handleChange(e) {
        //take value of inpiut fields and attach it as a property of the component:
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    //------------------- clicked save bio -----------------------
    async submit() {
        try {
            const { data } = await axios.post("/bio", {
                draftBio: this.state.draftBio
            });
            console.log("data", data);
            this.props.setBio(data);
            this.setState({
                editing: false
            });
        } catch (err) {
            console.log("err in POST /bio", err);
        }
    }

    render() {
        return (
            <div>
                {this.props.bio && !this.state.editing && (
                    <div>
                        <p>{this.props.bio}</p>
                        <button
                            onClick={e =>
                                this.setState({
                                    editing: true
                                })
                            }
                        >
                            Edit bio
                        </button>
                    </div>
                )}

                {this.state.editing && (
                    <div>
                        <textarea
                            name="draftBio"
                            onChange={e => this.handleChange(e)}
                        />
                        <button onClick={e => this.submit()}>Save</button>
                    </div>
                )}
                {!this.props.bio && !this.state.editing && (
                    <button
                        onClick={e =>
                            this.setState({
                                editing: true
                            })
                        }
                    >
                        Add your bio
                    </button>
                )}
            </div>
        );
    }
}
