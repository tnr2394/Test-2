import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import ImageAction from '../../Actions/image';
import DropzoneComponent from 'react-dropzone-component';
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
      // Dropzone Component properties
      imageId: '',
      taggeSuggestions: [],
      taggedUser: [],
      modalIsOpen: false, 
      images: [],
      djsConfig: {
        addRemoveLinks: true,
        acceptedFiles: 'image/jpeg,image/png',
        autoProcessQueue: false,
      },
      image: [],
      config: {
        iconFiletypes: ['.jpg', '.png'],
        showFiletypeIcon: true,
        postUrl: 'no-url',
      },
      selectedOption: null,
    };


    this.handleImageAdd = this.handleImageAdd.bind(this);
    this.displaySubGroupsList = this.displaySubGroupsList.bind(this);
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
      ImageAction
      .fetchAllImages(this.props.match.params.projectId)
      .then((res) => {
        if (!res.body.status) {
          this.showToast('error', res.body.message);
        } else {
          this.showToast('success', res.body.message);
          this.setState({
            images: res.body.data
          })
        }
      })
      .catch((err) => {
        this.showToast('error', "Something went wrong.");
      })
    }
  }

  handleFileAdded = (file) => {
    const files = this.state.image;
    files.push(file);
    this.setState({
      image: files,
    });
  };

  handleFileRemoved = (file) => {
    const images = this.state.image;

    const index = images.indexOf(file);

    if (index !== -1) {
      images.splice(index, 1);
    }

    this.setState({
      image: images,
    });
  };

  fetchUntaggedUser(id) {
    ImageAction
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
      this.showToast('error', "Something went wrong.");
    })
  }

  handleImageAdd(e) {
    e.preventDefault();

    //Add new project api call
    ImageAction
    .addNewImage({images: this.state.image}, this.props.match.params.projectId)
    .then((res) => {
      // Remove all uploaded preview images from preview part
      this.dropzone.removeAllFiles();
      if (res.body.status) {
        this.showToast('success', res.body.message);
        const existingImages = this.state.images;
        
        res.body.data.map((key) => {
          existingImages.push(key);
        });

        this.setState({
          image: []
        })
      } else {
        this.showToast('error', res.body.message);
      }
    })
    .catch((err) => {
      this.showToast('error', "Something went wrong.");
    })
  }

  deleteImage(SubgroupId) {
    // Delete project API call
    ImageAction.deleteImage(SubgroupId)
    .then((res) => {
      if (res.body.status) {
        this.showToast('success', res.body.message);
        
        const existingImages = this.state.images;
        _.remove(existingImages, {_id: SubgroupId});
        this.setState({
          images: existingImages
        });
      } else {
        this.showToast('error', res.body.message);
      }
    })
    .catch((err) => {
      this.showToast('error', "Something went wrong.");
    })
  }
  
  openModal(id, taggedUser) {
    console.log("taggedUser", taggedUser);
    this.setState({
      imageId: id,
      modalIsOpen: true,
      taggedUser
    });

    this.fetchUntaggedUser(id);
  }
  
  displaySubGroupsList() {
    if (this.state.images.length) {
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
                          <th className="column2">Image</th>
                          <th className="column3">Action</th>
                          
                      </tr>
                    </thead>
                    
                    <tbody>
                      {
                        this.state.images.map((temp, index) => {
                          const { _id } = temp;
                          return (
                            <tr key={_id}>
                              <td>{index+1}</td>
                              <td>
                                <img height="100px" width="100px" src={`http://localhost:3001/images/${temp.path}`} alt="Not available" />
                              </td>
                              <td>
                                <button onClick={this.deleteImage.bind(this,_id)}> Delete </button>
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
      return (<div>No Subgroups available</div>);
    }
  }

  handleChange = (selectedOption) => {
    if (selectedOption.length === 0) {
      this.setState({
        selectedOption: null
      });
    } else {
      this.setState({ selectedOption });
    }
  }

  addNewTag(e) {
    e.preventDefault();
    // Add this selected user as a tagged
    ImageAction
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
      this.showToast('error', "Something went wrong.");
    })
  }

  afterRemove(removedTaggedUserId) {
    // Update unTagged user list
    this.fetchUntaggedUser(this.state.imageId);
    // Update listing of tagged user
    const existingTaggedUsers = this.state.taggedUser;
    _.remove(existingTaggedUsers, {_id: removedTaggedUserId});
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
    const eventHandlers = {
      init: (dz) => {
        this.dropzone = dz;
      },
      addedfile: this.handleFileAdded.bind(this),
      removedfile: this.handleFileRemoved.bind(this),
      
    };
    const { selectedOption } = this.state;

    return (
      <div>
        <Header history={this.props.history} />
        <ToastContainer autoClose={8000} />
        
        <div className="container">        
          <form id="contact-three">
            <fieldset>
              <DropzoneComponent
                config={this.state.config}
                eventHandlers={eventHandlers}
                djsConfig={this.state.djsConfig}
              />
            </fieldset>
            <fieldset>
              <button
                name="submit"
                id="contact-submit"
                type="submit"
                onClick={(e) => {
                  this.handleImageAdd(e);
                }}
              >
                Add Images
              </button>
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
                      value={selectedOption}
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
                  type="image"
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