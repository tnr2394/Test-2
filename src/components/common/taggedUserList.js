import React, { Component } from 'react';
import ImageAction from '../../Actions/image';
import SubGroupAction from '../../Actions/sub-group';

class TaggedUserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            taggedUser: this.props.list ? this.props.list : [],
            type: this.props.type ? this.props.type : "",
            recordId: this.props.recordId ? this.props.recordId : "",
        };

        this.listAllTaggedUser = this.listAllTaggedUser.bind(this);
    }

    listAllTaggedUser() {
        if (this.state.taggedUser.length) {
            return (
                <div class="contact-five">
                    <div className="limiter">
                        <div className="container-table100">
                            <div className="wrap-table100">
                            <div className="table100">
                                <table>
                                    <thead>
                                        <tr className="table100-head">
                                            <th className="column1">No.</th>
                                            <th className="column2">Name</th>
                                            <th className="column3">Action</th>
                                        </tr>
                                    </thead>
                                
                                    <tbody>
                                        {
                                        this.state.taggedUser.map((temp, index) => {
                                            const { _id } = temp;
                                            return (
                                            <tr key={_id}>
                                                <td className="column1">{index+1}</td>
                                                <td className="column2">
                                                    { temp.firstName + ' ' + temp.lastName}
                                                </td>
                                                <td className="column3">
                                                    <button onClick={this.removeTaggedUser.bind(this, _id)}>Remove</button>
                                                </td>
                                            </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );
        } else {
            return (
                <div> No user tagged yet </div>
            )
        }
    }

    removeTaggedUser(userId) {
        if (this.state.type === "subGroup") {
            SubGroupAction
            .deleteTaggedUser(this.state.recordId, userId)
            .then((resp) => {
                this.props.afterRemoveCall(userId);
            })
            .catch((err) => {
                console.log("err", err);
            })
        } else if (this.state.type === "image") {
            ImageAction
            .deleteTaggedUser(this.state.recordId, userId)
            .then((resp) => {
                this.props.afterRemoveCall(userId);
            })
            .catch((err) => {
                console.log("err", err);
            })
        }
    }

    render() {
        console.log("this.props.state", this.state);

        return (
            <div>
                { this.listAllTaggedUser() }                
            </div>
        )
    }

}

export default TaggedUserList;