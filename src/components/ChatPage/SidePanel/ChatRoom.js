import React, { Component } from "react";
import { FaRegSmileWink } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import firebase from "firebase";
import {
  setCurrentChatRoom,
  setIsPrivate,
} from "../../../redux/actions/chatRoom_action";
export class ChatRoom extends Component {
  state = {
    show: false,
    name: "",
    description: "",
    messagesRef: firebase.database().ref("messages"),
    chatRoomsRef: firebase.database().ref("chatRooms"),
    chatRooms: [],
    activeChatRoomId: null,
    notifications: [],
  };

  componentDidMount() {
    this.AddChatRoosListener();
  }
  componentWillUnmount() {
    this.state.chatRoomsRef.off();
  }

  AddChatRoosListener = () => {
    let chatRoomsArray = [];

    //해당 이벤트는 항목의 child마다 한번씩 발동한다.(다중 발생)
    this.state.chatRoomsRef.on("child_added", (DataSnapshot) => {
      chatRoomsArray.push(DataSnapshot.val());
      //DataSnapshot의 value에 각 채팅방 정보가 담겨있다
      this.setState({ chatRooms: chatRoomsArray }, () => {
        //새로고침할 때 최초에만 첫번째 채팅룸으로 렌더링 하기 위한 시퀀스
        chatRoomsArray.length === 1 &&
          this.props.dispatch(setCurrentChatRoom(this.state.chatRooms[0])) &&
          this.setState({ activeChatRoomId: this.state.chatRooms[0].id });
      });
      this.addNotificationListener(DataSnapshot.key);
    });
  };
  addNotificationListener = (chatRoomId) => {
    this.state.messagesRef.child(chatRoomId).on("value", (DataSnapshot) => {
      if (this.props.currentChatRoom) {
        this.handleNotification(
          chatRoomId,
          this.props.currentChatRoom.id,
          this.state.notifications,
          DataSnapshot
        );
      }
    });
  };
  handleNotification = (
    chatRoomId,
    currentChatRoomId,
    notifications,
    DataSnapshot
  ) => {
    let index = notifications.findIndex(
      (notifications) => notifications.id === chatRoomId
    );
    if (index === -1) {
      notifications.push({
        id: chatRoomId,
        total: DataSnapshot.numChildren(),
        lastKnowTotal: DataSnapshot.numChildren(),
        count: 0,
      });
    } else {
      if (chatRoomId !== currentChatRoomId) {
        let lastTotal = notifications[index].lastKnowTotal;

        if (DataSnapshot.numChildren() - lastTotal > 0) {
          notifications[index].count = DataSnapshot.numChildren() - lastTotal;
        }
      }
      notifications[index].total = DataSnapshot.numChildren();
    }
    this.setState({ notifications });
  };
  getNotificationsCount = (room) => {
    let count = 0;
    this.state.notifications.forEach((notification) => {
      if (notification.id === room.id) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
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
  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setIsPrivate(false));
    this.setState({ activeChatRoomId: room.id });
  };
  renderChatRooms = (chatRooms) => {
    if (chatRooms.length)
      return chatRooms.map((room) => (
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 5,
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor:
              this.state.activeChatRoomId === room.id &&
              !this.props.isPrivate &&
              "#ffffff45",
          }}
          key={room.id}
          onClick={() => this.changeChatRoom(room)}
        >
          # {room.name}
          <Badge style={{ backgroundColor: "#e03131", height: "20px" }}>
            {this.getNotificationsCount(room)}
          </Badge>
        </li>
      ));
  };
  addChatRoom = async () => {
    const key = this.state.chatRoomsRef.push().key;
    //push를 하면 자동으로 생성되는 고유 key 값으로 child 이름이 생성된다(빈 테이터 생성)
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
      //key값으로 빈 데이터 child를 찾아서 update한다 (push로 바로 넣으면 key값 넣기가 애매하다)
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
          {`CHAT ROOMS (${this.state.chatRooms.length})`}
          <FaPlus style={{ cursor: "pointer" }} onClick={this.handleShow} />
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderChatRooms(this.state.chatRooms)}
        </ul>
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
            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
              Create
            </Button>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    isPrivate: state.chatRoom.isPrivate,
    currentChatRoom: state.chatRoom.currentChatRoom,
  };
};
export default connect(mapStateToProps)(ChatRoom);
