import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";

export default class Welcome extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <HashRouter>
                <div>
                    <img id="logo" src="puppy.png" />
                    <h1 id="brief-me">Brief.me</h1>
                    <h2>Welcome to our community</h2>
                    <p>We are here because we are amazing</p>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}
