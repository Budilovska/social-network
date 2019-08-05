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
                        <p className="bio-text">{this.props.bio}</p>
                        <button className="bio-btn"
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
                    <div className="text-area">
                        <textarea
                            name="draftBio"
                            onChange={e => this.handleChange(e)}
                        >{this.props.bio}</textarea>
                        <div>
                        <button className="bio-btn" onClick={e => this.submit()}>Save</button>
                        </div>
                    </div>
                )}
                {!this.props.bio && !this.state.editing && (
                    <button className="bio-btn"
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
