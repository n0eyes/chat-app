import React, { Component } from "react";
import { FaRegSmile } from "react-icons/fa";
import firebase from "firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setIsPrivate,
} from "../../../redux/actions/chatRoom_action";
export class DirectMessages extends Component {
  state = {
    usersRef: firebase.database().ref("user"),
    users: [],
    isLoaded: false,
  };

  componentDidMount() {
    if (!this.state.isLoaded) {
      //처음에 props를 받아오는데 시간이 걸려서 null로 인식하는 것을 대처하기 위함
      //추후 더 좋은 방식으로 개선
      setTimeout(() => {
        this.props.currentUser && this.addUsersListenrs(this.props.currentUser);
        this.setState({ isLoaded: true });
      }, 600);
    }
  }
  addUsersListenrs = (currentUser) => {
    const { usersRef } = this.state;
    const usersArray = [];
    usersRef.on("child_added", (DataSnapshot) => {
      const userInfo = DataSnapshot.val();
      // 해당 data의 uid가 key 프로퍼티에 저장되어있다.
      userInfo.uid = DataSnapshot.key;
      userInfo.status = "offline";
      currentUser.displayName !== userInfo.name && usersArray.push(userInfo);
      this.setState({ users: usersArray });
    });
  };
  getChatRoomdId = (userId) => {
    const currentUserId = this.props.currentUser.uid;
    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };
  changeChatRoom = (user) => {
    const chatRoomId = this.getChatRoomdId(user.uid);
    const chatRoomdData = {
      id: chatRoomId,
      name: user.name,
    };
    this.props.dispatch(setCurrentChatRoom(chatRoomdData));
    this.props.dispatch(setIsPrivate(true));
  };
  renderDirectMessages = () => {
    return (
      this.state.users.length > 0 &&
      this.state.users.map((user) => {
        return (
          <li
            key={this.getChatRoomdId(user.uid)}
            style={{
              paddingLeft: 5,
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor:
                this.props.isPrivate &&
                this.getChatRoomdId(user.uid) ===
                  this.props.currentChatRoom.id &&
                "#ffffff45",
            }}
            onClick={() => this.changeChatRoom(user)}
          >{`# ${user.name}`}</li>
        );
      })
    );
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaRegSmile style={{ marginRight: "11px", marginTop: "2px" }} />
          {`DIRECT MESSAGES (${this.state.users.length})`}
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderDirectMessages()}
        </ul>
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
export default connect(mapStateToProps)(DirectMessages);
