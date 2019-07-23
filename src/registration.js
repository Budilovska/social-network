import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    //------------------- getting input fields value -------------
    handleChange(e) {
        //take value of inpiut fields and attach it as a property of the component:
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    //------------------ handling submit registration ------------
    // submit() {
    //     axios.post('/welcome', {
    // first: this.state.first,
    // last: this.state.last,
    // email: this.state.email,
    // password: this.state.password
    //     }).then({data} => {
    //         console.log("hello");
    //     }).catch(function(err) {
    //                     console.log("err in axios.post /welcome", err);
    //                 }); //closes /comment get
    //     //do exactly as in petition, insert it in users database = hash the password.when it's successfullt and res.json( success - true )
    // }

    submit(e) {
        axios
            .post("/welcome/", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                    //user is now logged in, added cookie with userId
                } else {
                    this.setState({
                        error: true
                    });
                }
                console.log("data", data.success);
            })
            .catch(function(err) {
                console.log("err in axios.post /welcome", err);
            });
    }

    render() {
        return (
            <div>
                {this.state.error && <div className="error">Ooops!</div>}
                <input
                    name="first"
                    placeholder="first"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="last"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    onChange={e => this.handleChange(e)}
                />
                <button onClick={e => this.submit()}>register</button>
            </div>
        );
    }
}
