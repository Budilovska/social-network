import React from "react";
import ReactDOM from "react-dom";
// import AnimalsContainer from "./AnimalsContainer";
// import App from "./App";

import Welcome from "./welcome"; //create it and put in src folder

let elem;

if (location.pathname == "/welcome") {
    //they are logged out
    elem = <Welcome />;
} else {
    elem = <img id="logo" src="puppy.png" />;
    //they are logged in
}

ReactDOM.render(elem, document.querySelector("main"));

//this function can render only one component. To render several components, we need to create container component, that takes all components and then pass it here to render one container component. (App.js)

// ReactDOM.render(<App />, document.querySelector("main"));
//
//
// export default function HelloWorld() {
//     return (
//         <div>
//             <h1>My first component :)</h1>
//             <p>woooooooooooooo</p>
//         </div>
//     );
// }
