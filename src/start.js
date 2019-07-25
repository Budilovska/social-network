import React from "react";
import ReactDOM from "react-dom";
// import AnimalsContainer from "./AnimalsContainer";
// import App from "./App";

import Welcome from "./welcome"; //create it and put in s
//rc folder
import App from "./app";
let elem;

if (location.pathname == "/welcome") {
    //user is logged out
    elem = <Welcome />;
} else {
    elem = <App />;
    //user is logged in
}

ReactDOM.render(elem, document.querySelector("main"));

//this function can render only one component. To render several components, we need to create container component, that takes all components and then pass it here to render one container component. (App.js)
