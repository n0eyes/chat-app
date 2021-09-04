import React, { Component } from "react";
import { FaRegSmileWink } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import firebase from "firebase";
export class ChatRoom extends Component {
  state = {
    show: false,
    name: "",
    description: "",
    chatRoomsRef: firebase.database().ref("chatRooms"),
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });
  handleSubmit = (e) => {
    e.preventDefault();

    const { name, description } = this.state;

    if (this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  };
  isFormValid = (name, description) => name && description;
  addChatRoom = async () => {
    const key = this.state.chatRoomsRef.push().key;
    const { name, description } = this.state;
    const { currentUser } = this.props;
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: currentUser.displayName,
        image: currentUser.photoURL,
      },
    };
    try {
      await this.state.chatRoomsRef.child(key).update(newChatRoom);
      this.setState({
        name: "",
        description: "",
        show: false,
      });
    } catch (err) {
      alert(err);
    }
  };
  render() {
    return (
      <div>
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FaRegSmileWink />
          {`CHAT ROOMS (1)`}
          <FaPlus style={{ cursor: "pointer" }} onClick={this.handleShow} />

          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>Create a Chat Room</Modal.Title>
              <VscChromeClose
                style={{ cursor: "pointer" }}
                onClick={this.handleClose}
              />
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Room Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter chat room name"
                    onChange={(e) =>
                      this.setState({ name: e.currentTarget.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter chat room description"
                    onChange={(e) =>
                      this.setState({ description: e.currentTarget.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                onClick={this.handleSubmit}
              >
                Create
              </Button>
              <Button variant="secondary">Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  };
};
export default connect(mapStateToProps)(ChatRoom);
