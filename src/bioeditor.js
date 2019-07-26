import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

submit() {
    axios.post('/bio', {bio: this.state.draftBio}).then(data) {
        this.setState({editing: false})
    }
    this.props.done(data)


gather fields value
}

    render() {
        return (
            <div>
            {this.state.editing && <div><textarea name="draftBio"><button>Save</button><textarea></div>}
<button onClick={e => this.setState({editing: true})}>Add</button>
            </div>
        )
    }
}















// <BioEditor bio={} />
