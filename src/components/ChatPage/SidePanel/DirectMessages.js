import React, { Component } from "react";
import { FaRegSmile } from "react-icons/fa";
import firebase from "firebase";
import { connect } from "react-redux";
import { setCurrentChatRoom } from "../../../redux/actions/chatRoom_action";
export class DirectMessages extends Component {
  state = {
    usersRef: firebase.database().ref("user"),
    users: [],
    isLoaded: false,
  };

  componentDidUpdate() {
    if (!this.state.isLoaded) {
      this.props.currentUser && this.addUsersListenrs(this.props.currentUser);
      this.setState({ isLoaded: true });
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
  };
  renderDirectMessages = () =>
    this.state.users.length > 0 &&
    this.state.users.map((user) => (
      <li
        key={user.uid}
        style={{
          paddingLeft: 5,
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={() => this.changeChatRoom(user)}
      >{`# ${user.name}`}</li>
    ));

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FaRegSmile />
          {`DIRECT MESSAGES (1)`}
          <div />
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
  };
};
export default connect(mapStateToProps)(DirectMessages);

//처음에는 await 없이 비동기로 진행
// 그담으에 await 넣고 동기식으로 진행해도 결과가 같음
// 결국 비동기함수 내부로 넣으니 가능하다
