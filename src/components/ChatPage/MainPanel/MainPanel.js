import React, { Component } from "react";
import Messages from "./Messages";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import { connect } from "react-redux";
import {
  setImageRefInMessges,
  setLoadMessges,
} from "../../../redux/actions/chatRoom_action";
import firebase from "firebase";
export class MainPanel extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messagesLoading: true,
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
  };

  componentDidMount() {
    //채팅방 아이디 겟
    const { currentChatRoom } = this.props;
    if (currentChatRoom) {
      this.addMessageListener(currentChatRoom.id);
      // this.addMessageUpdateListener(currentChatRoom.id);
    }
  }
  componentWillUnmount() {
    this.state.messagesRef.off();
  }
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

  async addMessageListener(chatRoomId) {
    //메세지가 없으면 메세지 테이블이 생성되지 않는다
    let messagesArray = [];
    await this.state.messagesRef
      .child(chatRoomId)
      .get()
      .then((DataSnapshot) => {
        //따라서 이벤트 리스너는 무조건 등록해주지만(데이터가 없으면 콜백이 한번도 실행되지 않음)
        this.state.messagesRef
          .child(chatRoomId)
          .on("child_added", (DataSnapshot) => {
            messagesArray.push(DataSnapshot.val());
            this.props.dispatch(setLoadMessges(messagesArray));
            this.setState({ messagesLoading: false });
          });
        !DataSnapshot.exists() &&
          this.props.dispatch(setLoadMessges(messagesArray));
        return messagesArray;
      });
  }

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

  render() {
    return (
      <div style={{ padding: "25px", height: "100vh" }}>
        <MessagesHeader handleSearchChange={this.handleSearchChange} />
        <div
          style={{
            border: "2px solid #ececec",
            width: "100%",
            height: "60vh",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          {/* 조건으로 serachResultf를 사용하면 searchTerm이 빈 문자열일 때
              빈 문자들로 이루어진 배열을 반환해서 불가능(정규표현식 구글링)
          */}
          {this.state.searchTerm
            ? this.renderMessages(this.state.searchResults)
            : this.renderMessages(this.props.messages)}
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
    messages: state.chatRoom.messages,
  };
};
export default connect(mapStateToProps)(MainPanel);
