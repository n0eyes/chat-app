import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import firebase from "firebase";
import { useSelector } from "react-redux";
//커밋 오류로 인한 재커밋 3try
function MessagesForm() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = firebase.database().ref("messages");
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );

  const createMessage = (fileURL = null) => {
    console.log(firebase.database());
    const message = {
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

      <ProgressBar now={60} variant="warning" style={{ margin: "20px 0" }} />
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
          <button className="message-form-button" style={{ width: "100%" }}>
            UPLOAD
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default MessagesForm;
