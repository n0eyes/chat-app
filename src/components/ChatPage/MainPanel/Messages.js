import React from "react";
import Toast from "react-bootstrap/Toast";
import moment from "moment";
import { useSelector } from "react-redux";
function Messages({ message, user }) {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();
  const isMyMessage = (message, user) => message.user.id === user?.uid;
  const currentUser = useSelector((state) => state.user.currentUser);
  return (
    <>
      <Toast
        style={{
          marginBottom: "20px",
          backgroundColor: isMyMessage(message, user) && "#e9ecef",
        }}
      >
        <Toast.Header closeButton={false}>
          <img
            width="48"
            height="48"
            src={
              isMyMessage(message, user)
                ? currentUser.photoURL
                : message.user.image
            }
            alt={message.user.name}
            className="rounded me-2"
          />
          <strong className="me-auto">{message.user.name}</strong>
          <small>{timeFromNow(message.timestamp)}</small>
        </Toast.Header>
        <Toast.Body>
          {/* 이미지를 보냈을 때 */}
          {message.image && (
            <img
              width="70"
              height="70"
              src={message.image}
              alt={message.user.name}
            />
          )}
          {message.chatContent && message.chatContent}
        </Toast.Body>
      </Toast>
    </>
  );
}

export default Messages;
