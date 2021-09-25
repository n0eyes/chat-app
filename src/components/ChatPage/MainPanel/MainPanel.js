import React, { Component } from "react";
import Messages from "./Messages";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import { connect } from "react-redux";
import { setUserPosts } from "../../../redux/actions/chatRoom_action";
import firebase from "firebase";
export class MainPanel extends Component {
  messageEndRef = React.createRef();

  state = {
    messages: [],
    messagesRef: firebase.database().ref("messages"),
    messagesLoading: true,
    typingRef: firebase.database().ref("typing"),
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
    typingUsers: [],
    listenerLists: [],
  };

  //  <! ---firebase db 보안 규칙 설정하기 --->
  componentDidMount() {
    //채팅방 아이디 겟
    const { currentChatRoom } = this.props;
    if (currentChatRoom) {
      this.addMessageListener(currentChatRoom.id);
      this.addTypingListener(currentChatRoom.id);
    }
  }
  componentDidUpdate() {
    if (this.messageEndRef) {
      this.messageEndRef.scrollIntoView({ behavior: "smooth" });
    }
  }
  componentWillUnmount() {
    this.state.messagesRef.off();
    this.removeListeners(this.state.listenerLists);
  }
  removeListeners = (listeners) => {
    listeners.forEach((listener) => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };
  addTypingListener = (chatRoomId) => {
    let typingUsers = [];
    this.state.typingRef.child(chatRoomId).on("child_added", (DataSnapshot) => {
      if (DataSnapshot.key !== this.props.currentUser?.uid) {
        typingUsers = typingUsers.concat({
          id: DataSnapshot.key,
          name: DataSnapshot.val(),
        });
        this.setState({ typingUsers });
      }
    });

    this.addToListenerLists(chatRoomId, this.state.typingRef, "child_added");

    this.state.typingRef
      .child(chatRoomId)
      .on("child_removed", (DataSnapshot) => {
        const index = typingUsers.findIndex(
          (user) => user.id === DataSnapshot.key
        );
        if (index !== -1) {
          typingUsers = typingUsers.filter(
            (user) => user.id !== DataSnapshot.key
          );
          this.setState({ typingUsers });
        }
      });

    this.addToListenerLists(chatRoomId, this.state.typingRef, "child_removed");
  };

  addToListenerLists = (id, ref, event) => {
    const index = this.state.listenerLists.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });
    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({
        listenerLists: this.state.listenerLists.concat(newListener),
      });
    }
  };
  handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        message.chatContent &&
        (message.chatContent.match(regex) || message.user.name.match(regex))
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
  };
  handleSearchChange = (e) => {
    this.setState(
      {
        searchTerm: e.currentTarget.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };
  //실시간 프로필 이미지 변경 적용
  // addMessageUpdateListener(chatRoomId) {
  //   this.state.messagesRef
  //     .child(chatRoomId)
  //     .on("child_changed", (DataSnapshot) => {
  //       const currentUserId = DataSnapshot.val().user.id;
  //       const downloadURL = DataSnapshot.val().user.image;
  //       this.props.dispatch(
  //         setImageRefInMessges({ currentUserId, downloadURL })
  //       );
  //       this.setState({ messagesLoading: false });
  //       return;
  //     });
  // }

  addMessageListener = async (chatRoomId) => {
    let messagesArray = [];
    this.state.messagesRef
      .child(chatRoomId)
      .on("child_added", (DataSnapshot) => {
        messagesArray.push(DataSnapshot.val());
        this.setState({ messages: messagesArray, messagesLoading: false });
        this.userPostsCount(messagesArray);
      });
  };
  userPostsCount = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.dispatch(setUserPosts(userPosts));
  };
  renderMessages = (messages) => {
    if (messages?.length > 0)
      return messages.map((message) => (
        <Messages
          key={message.timestamp}
          message={message}
          user={this.props.currentUser}
        />
      ));
    else return;
  };
  renderTypingUsers = (typingUsers) =>
    typingUsers.length > 0 &&
    typingUsers.map((user) => (
      <span key={user.id}>{user.name}님이 채팅을 입력하고 있습니다..</span>
    ));

  render() {
    return (
      <div style={{ padding: "25px", height: "100vh" }}>
        <MessagesHeader handleSearchChange={this.handleSearchChange} />
        <div
          style={{
            border: "2px solid #ececec",
            width: "100%",
            height: "65vh",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {/* 조건으로 serachResultf를 사용하면 searchTerm이 빈 문자열일 때
              빈 문자들로 이루어진 배열을 반환해서 불가능(정규표현식 구글링)
          */}
          {this.state.searchTerm
            ? this.renderMessages(this.state.searchResults)
            : this.renderMessages(this.state.messages)}
          {this.renderTypingUsers(this.state.typingUsers)}
          <div ref={(node) => (this.messageEndRef = node)} />
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
