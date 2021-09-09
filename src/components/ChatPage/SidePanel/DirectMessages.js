import React, { Component } from "react";
import { FaRegSmile } from "react-icons/fa";
import firebase from "firebase";
import { connect } from "react-redux";
export class DirectMessages extends Component {
  state = {
    usersRef: firebase.database().ref("user"),
    users: [],
    currentUser: this.props.currentUser,
  };

  componentDidMount() {
    this.props.currentUser && this.addUsersListenrs(this.state.currentUser);
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
    });
    this.setState({ users: usersArray });
  };

  renderDirectMessages = () => {
    if (this.state.users.length > 0)
      return this.state.users.map((user) => {
        return (
          <li
            style={{ paddingLeft: 5, cursor: "pointer", borderRadius: "5px" }}
            key={user.uid}
          >{`# ${user.name}`}</li>
        );
      });
  };

  render() {
    console.log("render-users", this.state.users);
    console.log("current-users", this.state.currentUser);
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
