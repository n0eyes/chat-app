import React, { Component } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import firebase from "firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setIsPrivate,
} from "../../../redux/actions/chatRoom_action";
export class Favorited extends Component {
  state = {
    favoritedChatRooms: [],
    usersRef: firebase.database().ref("user"),
  };
  componentDidMount() {
    setTimeout(() => {
      this.props.currentUser && this.addListeners(this.props.currentUser.uid);
    }, 500);
  }
  componentWillUnmount() {
    setTimeout(() => {
      this.props.currentUser &&
        this.state.usersRef
          .child(this.props.currentUser.uid)
          .child("favorited")
          .off();
    }, 500);
  }
  addListeners = (userId) => {
    const { usersRef } = this.state;

    usersRef
      .child(userId)
      .child("favorited")
      .on("child_added", (DataSnapshot) => {
        const favoritedChatRooms = {
          id: DataSnapshot.key,
          ...DataSnapshot.val(),
        };
        this.setState({
          favoritedChatRooms: [
            ...this.state.favoritedChatRooms,
            favoritedChatRooms,
          ],
        });
      });

    usersRef
      .child(userId)
      .child("favorited")
      .on("child_removed", (DataSnapshot) => {
        const chatRoomToRemove = {
          id: DataSnapshot.key,
          ...DataSnapshot.val(),
        };
        const filteredChatRooms = this.state.favoritedChatRooms.filter(
          (chatRoom) => {
            return chatRoom.id !== chatRoomToRemove.id;
          }
        );
        this.setState({
          favoritedChatRooms: filteredChatRooms,
        });
      });
  };
  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.isPrivate && this.props.dispatch(setIsPrivate(false));
    this.setState({ activeChatRoomId: room.id });
  };
  renderFavoritedChatRooms = (favoritedChatRooms) =>
    favoritedChatRooms.length > 0 &&
    favoritedChatRooms.map((room) => (
      <li
        key={room.id}
        onClick={() => this.changeChatRoom(room)}
        style={{
          paddingLeft: 5,
          cursor: "pointer",
          borderRadius: "5px",
          backgroundColor:
            this.state.activeChatRoomId === room.id &&
            !this.props.isPrivate &&
            "#ffffff45",
        }}
      >
        # {room.name}
      </li>
    ));
  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaRegSmileBeam style={{ marginRight: "11px", marginTop: "2px" }} />
          {`FAVORITED (${this.state.favoritedChatRooms.length})`}
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderFavoritedChatRooms(this.state.favoritedChatRooms)}
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

export default connect(mapStateToProps)(Favorited);
