import * as io from "socket.io-client";
import { chatMessages, newChatMessage, newPrivateMessage } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("newChatMessage", data =>
            store.dispatch(newChatMessage(data))
        );

        socket.on("chatMessages", data => store.dispatch(chatMessages(data)));

        socket.on("newPrivateMessage", data => {
            store.dispatch(newPrivateMessage(data));
            console.log("happened");
        });
    }
};

// socket.on('greeting', payload => console.log(payload));
//
// socket.emit('niceToBeHere', {
//     chicken: 'funky'
// });
