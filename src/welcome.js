import React from "react";

import Registration from "./registration";

export default class Welcome extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <img id="logo" src="puppy.png" />
                <h1>Welcome to our community</h1>
                <p>We are here because we are amazing</p>
                <Registration />
            </div>
        );
    }
}
