import React, { Component } from "react";
import Messages from "./Messages";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import { connect } from "react-redux";
import firebase from "firebase";
export class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: firebase.database().ref("messages"),
    messagesLoading: true,
  };

  componentDidMount() {
    //채팅방 아이디 겟
    const { currentChatRoom } = this.props;
    if (currentChatRoom) this.addMessageListener(currentChatRoom.id);
  }

  addMessageListener(chatRoomId) {
    let messagesArray = [];
    this.state.messagesRef
      .child(chatRoomId)
      .on("child_added", (DataSnapshot) => {
        messagesArray.push(DataSnapshot.val());
        this.setState({ messages: messagesArray, messagesLoading: false });
      });
  }
  renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Messages
        key={message.timestamp}
        message={message}
        user={this.props.currentUser}
      />
    ));
  render() {
    return (
      <div style={{ padding: "25px", height: "100vh" }}>
        <MessagesHeader />
        <div
          style={{
            border: "2px solid #ececec",
            width: "100%",
            height: "60vh",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          {this.renderMessages(this.state.messages)}
        </div>
        <MessagesForm />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    currentChatRoom: state.chatRoom.currentChatRoom,
  };
};
export default connect(mapStateToProps)(MainPanel);
