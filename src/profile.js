import React from "react";
// import Avatar from "./avatar";
// import Bioeditor from "./bioeditor";

export default function Profile(props) {
    return (
        <div>
            <h2>
                {props.first} {props.last}
            </h2>
            <div className="profile-avatar">{props.avatar}</div>
            {props.bioeditor}
        </div>
    );
}
