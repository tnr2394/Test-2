import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import SubGroupAction from '../../Actions/sub-group';
import Header from '../common/header';
import Modal from 'react-modal';
import Select from 'react-select';
import TaggedUserList from '../common/taggedUserList';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

  class Index extends Component {
    constructor(props) {
      super(props);

    this.state = {
      subGroups: [],
      title: "",
      imageId: '',
      taggeSuggestions: [],
      modalIsOpen: false,
      selectedOption: null,
      taggedUser: []
    };

    this.handleSubGroupAdd = this.handleSubGroupAdd.bind(this);
    this.displaySubGroupsList = this.displaySubGroupsList.bind(this);
  }
  
  componentWillMount() {
    if (cookies.get('token') === "" || cookies.get('token') === undefined) {
      // Remove cookie first and then redirect to login page
      cookies.remove('token');
      this.showToast('error', "Please login first");
      // Redirect to login page.
      this.props.history.push({
        pathname: '/'
      })
    } else {
      // Fetch all the projects with this user
      SubGroupAction
      .fetchAllSubGroup(this.props.match.params.projectId)
      .then((res) => {
        if (!res.body.status) {
          this.showToast('error', res.body.message);
        } else {
          this.showToast('success', res.body.message);
          this.setState({
            subGroups: res.body.data
          })
        }
      })
      .catch((err) => {
        this.showToast('error', 'Something went wrong');
      })
    }
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

  handleSubGroupAdd(e) {
    e.preventDefault();
    // Add new project api call
    SubGroupAction
    .addNewSubGroup(
      {title: this.state.title},
      this.props.match.params.projectId
    )
    .then((res) => {
      if (res.body.status) {
        this.showToast('success', res.body.message);

        const existingSubGroups = this.state.subGroups;
        existingSubGroups.push(res.body.data);
        
        this.setState({
          title: ''
        })
      } else {
        this.showToast('error', res.body.message);
      }
    })
    .catch((err) => {
      this.showToast('error', "Something went wrong");
    })
  }

  deleteSubGroup(SubgroupId) {
    // Delete project API call
    SubGroupAction.deleteSubGroup(SubgroupId)
    .then((res) => {
      this.showToast('success', res.body.message);

      // Update listing of sub groups
      const existingSubGroups = this.state.subGroups;
      _.remove(existingSubGroups, {_id: SubgroupId});
      this.setState({
        subGroups: existingSubGroups
      });
    })
    .catch((err) => {
      this.showToast('error', "Something went wrong");
    })
  }

  fetchUntaggedUser(id) {
    SubGroupAction
    .getUnTaggedUser(id)
    .then((res) => {
      if (res.body.status) {
        const { data } = res.body;

        const taggeSuggestions = data.map((key) => {
          return {
            value: key._id,
            label: `${key.firstName} ${key.lastName} `
          }
        });
        this.setState({
          taggeSuggestions
        });
      } else {
        this.showToast('error', res.body.message);
      }
    })
    .catch((err) => {
      this.showToast('error', "Something went wrong");
    })
  }
  
  openModal(id, taggedUser) {
    this.setState({
      imageId: id,
      modalIsOpen: true,
      taggedUser
    });

    this.fetchUntaggedUser(id);
  }

  displaySubGroupsList() {
    if (this.state.subGroups.length) {
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
                        this.state.subGroups.map((temp, index) => {
                          const { _id } = temp;
                          return (
                            <tr key={_id}>
                              <td className="column1">{index+1}</td>
                              <td className="column2">{temp.title}</td>
                              <td className="column3">
                                <button onClick={this.deleteSubGroup.bind(this,_id)}> Delete </button>
                                <button onClick={this.openModal.bind(this, _id, temp.taggedUsers)}>
                                  Add User tag
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
      return (
        <div className="contact-for">
          <div className="limiter">
            No Subgroups available
          </div>
        </div>
      );
    }
  }

  handleChange = (selectedOption) => {
    if (selectedOption.length === 0) {
      this.setState({ selectedOption: null });
    } else {
      this.setState({ selectedOption });
    }
  }

  addNewTag(e) {
    e.preventDefault();
    // Add this selected user as a tagged
    SubGroupAction
    .addNewTaggedUser({ id: this.state.selectedOption.value}, this.state.imageId)
    .then((res) => {
      if (res.body.status) {
        this.showToast('success', res.body.message);
        // Successfully user tagged
        const taggedUserList = this.state.taggedUser;
        taggedUserList.push(res.body.data);
        
        this.fetchUntaggedUser(this.state.imageId); 
        
        this.setState({
          selectedOption: null
        });
      } else {
        // error occured from backedn
        this.showToast('error', res.body.message);
      }
    })
    .catch((err) => {
      this.showToast('error', "Something went wrong");
    })
  }

  afterRemove(removedTaggedUserId) {
    // Update unTagged user list
    this.fetchUntaggedUser(this.state.imageId);
    // Update listing of tagged user
    const existingsubGroups = this.state.taggedUser;
    _.remove(existingsubGroups, {_id: removedTaggedUserId});
  }

  render() {
    return (
      <div>
        <Header history={this.props.history} />
        <ToastContainer autoClose={8000} />
        <div className="container">        
          <form id="contact-three" onSubmit={this.handleSubGroupAdd}>            
            <h1>Your Sub Groups</h1>
            <fieldset>
              <input
                onChange={(e) => this.setState({ title: e.target.value })}
                type="text"
                id="title"
                name="title"
                value={this.state.title}
                placeholder="Enter Subgroup title" 
              />
            </fieldset>
            <fieldset>
              <button type="submit"> Add </button>
            </fieldset>
          </form>
          <div>
            {
              this.displaySubGroupsList()
            }
          </div>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => { this.setState({ modalIsOpen: false }) }}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <div id="">
            <div style={{top: "199.5px", left: "551.5px"}} id="dialog" className="window">
              <div className="container">
                <form id="contact-for" onSubmit={this.addNewTag.bind(this)}>
                  <fieldset>
                    <Select
                      id="id_child"
                      className="dependent-selects__child form-control"
                      value={this.state.selectedOption}
                      onChange={this.handleChange}
                      options={this.state.taggeSuggestions}
                    />
                  </fieldset>
                  <fieldset>
                    <button
                      name="submit"
                      type="submit"
                      id="contact-submit"
                      // onClick={}
                      disabled={this.state.selectedOption === null ? true : false}
                    > 
                      Tag User 
                    </button>
                  </fieldset>
                </form>

                <div className="line linetwo linethree"></div>

                <TaggedUserList 
                  list={this.state.taggedUser}
                  type="subGroup"
                  recordId={this.state.imageId}
                  afterRemoveCall={this.afterRemove.bind(this)}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Index;