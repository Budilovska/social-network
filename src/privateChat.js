import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function PrivateChat() {
    const messages = useSelector(state => state && state.message);

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const keyCheck = e => {
        console.log("e.target.value", e.target.value);

        if (e.key == "Enter" && e.target.value !== "") {
            e.preventDefault(); //prevents jump to the next line
            // console.log("Enter was clicked");
            socket.emit("new private message", e.target.value);
            //cleaning inp field:
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <h1>Chat with ...</h1>
            <div className="chat-container" ref={elemRef}>
                <p>Private chat will be here...hopefully</p>
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            />
        </div>
    );
}
