import axios from "./axios";

export async function getFriends() {
    const { data } = await axios.get("/friends.json");
    // console.log("data from actions", data);
    return {
        type: "GET_FRIENDS",
        friends: data
    };
}

export async function unfriend(id) {
    const { data } = await axios.post(`/friendship/${id}`, {
        button: "Unfriend"
    });
    console.log("data", data);
    return {
        type: "UNFRIEND",
        id
    };
}

export async function accept(id) {
    const { data } = await axios.post(`/friendship/${id}`, {
        button: "Accept friend request"
    });
    console.log("data", data);
    return {
        type: "ACCEPT",
        id
    };
}
