import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import moment from "moment";
import ImageExpansion from "../../../ImageExpansion";
function Messages({ message, user }) {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();
  const isMyMessage = (message, user) => {
    return message.user?.id === user?.uid;
  };
  const [imageExpand, setImageExpand] = useState(false);
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
            style={{ cursor: "pointer" }}
            width="48"
            height="48"
            src={
              isMyMessage(message, user) ? user.photoURL : message.user.image
            }
            alt={message.user.name}
            className="rounded me-2"
            onClick={() => setImageExpand((prev) => !prev)}
          />
          <strong className="me-auto">{message.user.name}</strong>
          <small>{timeFromNow(message.timestamp)}</small>
        </Toast.Header>
        <Toast.Body>
          {/* 이미지를 보냈을 때 */}
          {message.image && (
            <img
              style={{ cursor: "pointer" }}
              width="70"
              height="70"
              src={message.user.image}
              alt={message.user.name}
              onClick={() => setImageExpand((prev) => !prev)}
            />
          )}
          {message.chatContent && message.chatContent}
        </Toast.Body>
      </Toast>
      {imageExpand && (
        <ImageExpansion
          imageURL={
            isMyMessage(message, user) ? user.photoURL : message.user.image
          }
          close={setImageExpand}
        />
      )}
      {}
    </>
  );
}

export default Messages;
