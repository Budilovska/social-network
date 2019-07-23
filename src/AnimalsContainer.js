// import React from "react";
//
// //every single componet needs to import React
// //1. we create our component:
export default class AnimalsContainer extends React.Component {
    constructor(props) {
        super(props); //creating "this"
    }
    render() {
        console.log("this.props.name:", this.props.name); //"this refers to animalsContaibner COmponent"
        return (
            <div>
                <h1>
                    {this.props.name} is {this.props.cutenessScore}
                </h1>
            </div>
        );
    }
}

//2.now we need to render our component

//the child component that receives the state from app will receive at as "PROPS" - it's a state of a parent component
//look up!!

//class component has states and lifecycle methods
//function components do not have these: it's good for just rendering stuff on screen

//now we rewrite animalsContainer as function component:

import React from "react";

export default function AnimalsContainer(props) {
    return (
        <div>
            <h1>
                {props.name} is {props.cutenessScore}
            </h1>
        </div>
    );
}
