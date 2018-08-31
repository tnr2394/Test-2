import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Index extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            token: cookies.get('token') ? cookies.get('token') : ''
        }
    }
    logout(e) {
        cookies.remove('token');
        // Redirect to login page.
        this.props.history.push({
            pathname: '/'
        })
    }

    render() {
        return (
            <div className="main-title">
                <div className="container">
                    <h2>Test Project</h2>
                    {
                        this.state.token !== "" ? <span><a onClick={this.logout.bind(this)}>Logout</a></span> : ''
                    }
                    
                </div>
            </div>
        );
    }
}

export default Index;