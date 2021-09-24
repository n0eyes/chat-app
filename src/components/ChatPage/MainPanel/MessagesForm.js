import React, { useState, useRef, useCallback } from "react";
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
  const typingRef = firebase.database().ref("typing");
  const currentUser = useSelector((state) => state.user.currentUser);
  const inputOpenImageRef = useRef();
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const isPrivate = useSelector((state) => state.chatRoom.isPrivate);

  const getFilePath = () =>
    isPrivate
      ? `/message/private/${currentChatRoom.id}`
      : `/message/public/${currentChatRoom.id}`;
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const filePath = `${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) };
    try {
      setLoading(true);
      const uploadTask = firebase
        .storage()
        .ref(getFilePath())
        .child(filePath)
        .put(file, metadata);

      uploadTask.on(
        "state_changed",
        (UploadTaskSnapshot) => {
          const percentage = Math.round(
            (UploadTaskSnapshot.bytesTransferred /
              UploadTaskSnapshot.totalBytes) *
              100
          );
          setPercentage(percentage);
        },
        (err) => {
          console.log(err);
          setLoading(false);
        },
        () => {
          //task 완료 후 실행 // 저장 된 파일 db에 저장하기
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            messagesRef
              .child(currentChatRoom.id)
              .push()
              .set(createMessage(downloadURL));
          });
          setLoading(false);
        }
      );
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
      ...(fileURL ? { image: fileURL } : { chatContent: content }),
    };
    return message;
  };
  const handleSubmit = async (e) => {
    if (!content) {
      setErrors((prev) => [...prev, "Type contents first"]);
      setTimeout(() => setErrors([]), 2000);

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
  const handleKeyDown = useCallback(() => {
    if (content && currentChatRoom) {
      typingRef
        .child(currentChatRoom.id)
        .child(currentUser.uid)
        .set(currentUser.displayName);
    } else {
      currentChatRoom &&
        typingRef.child(currentChatRoom.id).child(currentUser.uid).remove();
    }
  }, [content, typingRef, currentUser, currentChatRoom]);
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            onChange={handleChange}
            value={content}
            onKeyDown={handleKeyDown}
            as="textarea"
            row={3}
          ></Form.Control>
        </Form.Group>
      </Form>
      {percentage !== 0 && percentage !== 100 && (
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
            disabled={loading}
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: "100%" }}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            disabled={loading}
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
        accept="image/jpeg, image/png"
        ref={inputOpenImageRef}
        style={{ display: "none" }}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessagesForm;
