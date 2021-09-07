import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import firebase from "firebase";
import { useSelector } from "react-redux";
import mime from "mime-types";
function MessagesForm() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const messagesRef = firebase.database().ref("messages");
  const currentUser = useSelector((state) => state.user.currentUser);
  const inputOpenImageRef = useRef();
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const filePath = `${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) };

    try {
      const uploadTask = firebase
        .storage()
        .ref("/message/public/")
        .child(filePath)
        .put(file, metadata);

      uploadTask.on("state_changed", (UploadTaskSnapshot) => {
        const percentage = Math.round(
          (UploadTaskSnapshot.bytesTransferred /
            UploadTaskSnapshot.totalBytes) *
            100
        );
        setPercentage(percentage);
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const createMessage = (fileURL = null) => {
    const message = {
      //firebase 공식문서 참고
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName,
        image: currentUser.photoURL,
      },
      ...(fileURL ? { images: fileURL } : { chatContent: content }),
    };
    return message;
  };
  const handleSubmit = async (e) => {
    if (!content) {
      setErrors((prev) => [...prev, "Type contents first"]);
      return;
    }
    if (loading) return;
    try {
      setLoading(true);
      await messagesRef.child(currentChatRoom.id).push().set(createMessage());
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (err) {
      setErrors((prev) => [...prev, err.message]);
    }
  };
  const handleChange = (e) => {
    setContent(e.currentTarget.value);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            value={content}
            onChange={handleChange}
            as="textarea"
            row={3}
          ></Form.Control>
        </Form.Group>
      </Form>
      {percentage != 0 && percentage != 100 && (
        <ProgressBar
          now={percentage}
          variant="warning"
          style={{ margin: "20px 0" }}
        />
      )}
      <div>
        {errors.map((errorMsg) => (
          <p>{errorMsg}</p>
        ))}
      </div>
      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: "100%" }}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={() => inputOpenImageRef.current.click()}
          >
            UPLOAD
          </button>
        </Col>
      </Row>
      <input
        type="file"
        ref={inputOpenImageRef}
        style={{ display: "none" }}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessagesForm;
