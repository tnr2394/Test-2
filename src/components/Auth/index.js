import React, { Component } from 'react';
import AuthAction from '../../Actions/auth';
import GoogleLogin from 'react-google-login';
import Cookies from 'universal-cookie';
import Config from '../../config';
import Header from '../common/header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const cookies = new Cookies();

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signupShow: true,
      loginShow: false,
      singup: {
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      },
      login: {
        lemail: '',
        lpassword: ''
      }
    };

    this.handleRegister = this.handleRegister.bind(this);
    this.handleSignupChange = this.handleSignupChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);    
  }

  componentDidMount() {
    if (cookies.get('token') === "" || cookies.get('token') === undefined) {
    } else {
      // Redirect to login page.
      this.props.history.push({
        pathname: '/dashboard'
      })
    }
  }

  handleRegister(e) {
    e.preventDefault();
    AuthAction.signupWithEmail(this.state.singup)
    .then((res) => {
      if (!res.body.status) {
        this.showToast("error", res.body.message);
      } else {
        this.showToast("success", res.body.message);

        this.setState({
          singup: {
            email: '',
            password: '',
            firstName: '',
            lastName: ''
          },
          loginShow: true,
          signupShow: false
        });
      }
    })
    .catch((err) => {
      this.showToast("error", "Something went wrong");
    })
  }

  handleSignupChange(e) {
    e.preventDefault();
    const inputName = e.target.name;
    const inputValue = e.target.value;
    this.state.singup[inputName] = inputValue;
    this.setState(this.state);
  }

  handleLoginChange(e) {
    e.preventDefault();
    const inputName = e.target.name;
    const inputValue = e.target.value;
    this.state.login[inputName] = inputValue;
    this.setState(this.state);
  }

  handleLogin(e) {
    e.preventDefault();
    AuthAction
    .loginWithEmail({ email: this.state.login.lemail, password: this.state.login.lpassword })
    .then((res) => {
      if (!res.body.status) {
        this.showToast("error", res.body.message);
      } else {
        cookies.set('token', res.body.token, { path: '/' });
        this.showToast("success", res.body.message);        
        // Redirect to dashboard
        this.props.history.push({
          pathname: '/dashboard'
        })
      }
    })
    .catch((err) => {
      this.showToast("error", "Something went wrong");
    })
  }

  responseGoogle(response) {
    const userData = {
      userData: response.profileObj,
      tokenDetails: response.tokenObj
    };

    AuthAction
    .socialSignin(userData)
    .then((res) => {
      if (res.body.status) {
        cookies.set('token', res.body.token, { path: '/' });
        this.showToast("success", res.body.message);
        // Redirect to dashboard
        this.props.history.push({
          pathname: '/dashboard'
        });
      } else {
        this.showToast("error", res.body.message);
      }
    })
    .catch((err) => {
      this.showToast("error", "Something went wrong");
    })
  }

  failGoogle(response) {
    this.showToast("error", "Please try again. Something went wrong.");
  }

  showToast(type, message) {
    if (type === "error") {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    } if (type === "success") {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  render() {
    return (
      <div>
        <Header />
        <ToastContainer autoClose={8000} />
        <div className="container">
          <div id="contact-two">
              <ul>
                  <li style={{backgroundColor: this.state.signupShow ? '#fca40a' : '#02bffe'}}><a onClick={(e) => { this.setState({ signupShow: true, loginShow: false }); }}>Register</a></li>
                  <li style={{backgroundColor: this.state.loginShow ? '#fca40a' : '#02bffe'}}><a onClick={(e) => { this.setState({ signupShow: false, loginShow: true }); }}>Login</a></li>
              </ul>
          </div>
          
          <form id="contact" onSubmit={this.handleRegister} style={{display: this.state.signupShow ? 'block' : 'none'}}>            
            <fieldset>
              <input
                onChange={this.handleSignupChange}
                type="text"
                id="firstName"
                name="firstName"
                value={this.state.singup.firstName}
                placeholder="Enter Firstname" 
              />
            </fieldset>
            <fieldset>
              <input
                onChange={this.handleSignupChange}
                type="text"
                id="lastName"
                name="lastName"
                value={this.state.singup.lastName}
                placeholder="Enter lastname" 
              />
            </fieldset>
            <fieldset>
              <input
                onChange={this.handleSignupChange}
                type="email"
                id="email"
                name="email"
                value={this.state.singup.email}
                placeholder="Enter email" 
              />
            </fieldset>
            <fieldset>
              <input
                onChange={this.handleSignupChange}
                type="password"
                id="password"
                name="password"
                value={this.state.singup.password}
                placeholder="Enter password" 
              />
            </fieldset>
            <div>
              <button name="submit" id="contact-submit" type="submit"> Register </button>
            </div>
          </form>

          <form onSubmit={this.handleLogin} id="contact" style={{display: this.state.loginShow ? 'block' : 'none'}}>
            <fieldset>
              <input
                onChange={this.handleLoginChange}
                type="email"
                id="lemail"
                name="lemail"
                value={this.state.login.lemail}
                placeholder="Enter email" 
              />
            </fieldset>
            <fieldset>
              <input
                onChange={this.handleLoginChange}
                type="password"
                id="lpassword"
                name="lpassword"
                value={this.state.login.lpassword}
                placeholder="Enter password" 
              />
            </fieldset>
            <div>
              <button name="submit" id="contact-submit" type="submit"> Login </button>
            </div>
          </form>
          <div id="google-login">
            <GoogleLogin
              clientId={Config.gmailClientId}
              buttonText="Login"
              onSuccess={this.responseGoogle.bind(this)}
              onFailure={this.failGoogle.bind(this)}
            >
              <span> Login with G+ </span>
            </GoogleLogin>
          </div>
        </div>

        
      </div>
    );
  }
}

export default Index;