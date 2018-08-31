import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import ProjectAction from '../../Actions/project';
import Header from '../common/header';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      title: "" 
    };

    this.handleProjectAdd = this.handleProjectAdd.bind(this);
    this.displayProjectList = this.displayProjectList.bind(this);
  }
  
  componentWillMount() {
    if (cookies.get('token') === "" || cookies.get('token') === undefined) {
      // Remove cookie first and then redirect to login page
      cookies.remove('token');
      this.showToast("error", "Please login first.");
      // Redirect to login page.
      this.props.history.push({
        pathname: '/'
      })
    } else {
      // Fetch all the projects with this user
      ProjectAction.fetchAllProjects()
      .then((res) => {
        if (!res.body.status) {
          this.showToast("error", res.body.message);
        } else {
          this.showToast("success", res.body.message);
          
          this.setState({
            projects: res.body.data
          })
        }
      })
      .catch((err) => {
        this.showToast("error", "something went wrong");
      })
    }
  }

  handleProjectAdd(e) {
    e.preventDefault();
    // Add new project api call
    ProjectAction
    .addNewProject({title: this.state.title})
    .then((res) => {
      if (res.body.status) {
        this.showToast("success", res.body.message);
        const existingProjects = this.state.projects;
        existingProjects.push(res.body.data);
        
        this.setState({
          title: ''
        })
      } else {
        this.showToast("success", res.body.message);
      }
    })
    .catch((err) => {
      this.showToast("error", "something went wrong");
    })
  }

  deleteProject(projectId) {
    // Delete project API call
    ProjectAction.deleteProject(projectId)
    .then((res) => {
      if (res.body.status) {
        this.showToast('success', res.body.message);
        
        const existingImages = this.state.projects;
        _.remove(existingImages, { _id: projectId });
        this.setState({
          projects: existingImages
        });
      } else {
        this.showToast('error', res.body.message);
      }
    })
    .catch((err) => {
      this.showToast("error", "something went wrong");      
    })
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

  displayProjectList() {
    if (this.state.projects.length) {
      return (
        <div className="contact-for">
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
                        this.state.projects.map((temp, index) => {
                          const { _id } = temp;
                          return (
                            <tr key={_id}>
                              <td className="column1">{index+1}</td>
                              <td className="column2">{temp.title}</td>
                              <td className="column3">
                                <button
                                  onClick={this.deleteProject.bind(this,_id)}
                                >
                                    Delete
                                </button>

                                <button
                                  onClick={(e) => {
                                    // Redirect to dashboard
                                    this.props.history.push({
                                      pathname: `/image/${_id}`
                                    })
                                  }}>
                                    Manage images
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    // Redirect to dashboard
                                    this.props.history.push({
                                      pathname: `/subgroup/${_id}`
                                    })
                                  }}>
                                    Manage subgroups
                                </button>

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
      return (<div>No projects available</div>);
    }
  }

  render() {
    return (
      <div>
        <Header history={this.props.history} />
        <ToastContainer autoClose={8000} />
        <div className="container">        
          <form id="contact-three" onSubmit={this.handleProjectAdd}>            
            <h1>Your Projects</h1>
            <fieldset>
              <input
                onChange={(e) => this.setState({ title: e.target.value })}
                type="text"
                id="title"
                name="title"
                value={this.state.title}
                placeholder="Enter Project title" 
              />
            </fieldset>
            <fieldset>
              <button name="submit" type="submit" id="contact-submit"> Login </button>
            </fieldset>
          </form>
          
          <div>
            {
              this.displayProjectList()
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Index;