import React from "react";
import Uploader from "./uploader";
import Avatar from "./avatar";
import axios from "./axios";
import Profile from "./profile";
import Bioeditor from "./bioeditor";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
    }
    //componentDidMount will pass info to Avatar component
    async componentDidMount() {
        console.log("mounted");
        try {
            const { data } = await axios.get("/user");
            // console.log("data", data);
            this.setState(data);
        } catch (err) {
            console.log("err in GET /user", err);
        }
    }

    render() {
        return (
            <div className="wraps-all">
                <header>
                    <img id="logo" src="puppy.png" alt="logo" />
                    <Avatar
                        image={this.state.image}
                        first={this.state.first}
                        last={this.state.last}
                        onClick={() =>
                            this.setState({
                                uploaderIsVisible: true
                            })
                        }
                    />
                </header>
                <section className="main-container">
                    <Profile
                        first={this.state.first}
                        last={this.state.last}
                        bio={this.state.bio}
                        avatar={
                            <Avatar
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                image={this.state.image}
                                onClick={() =>
                                    this.setState({
                                        uploaderIsVisible: true
                                    })
                                }
                            />
                        }
                        bioeditor={
                            <Bioeditor
                                bio={this.state.bio}
                                // setBio={this.setBio}
                                setBio={data =>
                                    this.setState({
                                        bio: data
                                    })
                                }
                            />
                        }
                    />

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setImg={data =>
                                this.setState({
                                    image: data,
                                    uploaderIsVisible: false
                                })
                            }
                            closeUploader={() =>
                                this.setState({
                                    uploaderIsVisible: false
                                })
                            }
                        />
                    )}
                </section>
            </div>
        );
    }
}

//<Uploader done={image => this.setState({ image })} />
//by changig state property we make smth appear and diappear
//in the future we'll add here routing
//in profile pic in "alt attribute" we add users first and last name

// make rout in index.js '/user' and get user information (it will use userId cookie) - first, last, image url, bio
// in database add two columns in users table: for bio and for image url
//     const {data} will receive first, last, image, bio. when we get this data - pass it set state. data is an object by itself with all properties we need - then app will be able t opass this stuff to children
//
//     componentDidMOiunts runs after render runds for the first time
//
//                     image = {this.state.image} - we're setting a prop, and pass it to Avatar
