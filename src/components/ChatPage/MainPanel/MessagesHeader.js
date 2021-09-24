import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { ImNeutral } from "react-icons/im";
import { ImSmile2 } from "react-icons/im";
import { useSelector } from "react-redux";
import firebase from "firebase";
function MessagesHeader({ handleSearchChange }) {
  const userRef = firebase.database().ref("user");
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const isPrivate = useSelector((state) => state.chatRoom.isPrivate);
  const userPosts = useSelector((state) => state.chatRoom.userPosts);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const addFavoriteListener = (chatRoomId, userId) => {
      userRef
        .child(userId)
        .child("favorited")
        .once("value")
        .then((data) => {
          if (data.val()) {
            const chatRoomIds = Object.keys(data.val());
            const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
            setIsFavorited(isAlreadyFavorited);
          }
        });
    };
    currentUser &&
      currentChatRoom &&
      addFavoriteListener(currentChatRoom?.id, currentUser?.uid);
  }, [currentUser, currentChatRoom, userRef]);

  const handleFavorite = () => {
    if (isFavorited) {
      userRef
        .child(`${currentUser.uid}/favorited`)
        .child(currentChatRoom.id)
        .remove((err) => {
          !err && console.error(err);
        });
      setIsFavorited((prev) => !prev);
    } else {
      userRef
        .child(`${currentUser.uid}/favorited/${currentChatRoom.id}`)
        .update({
          name: currentChatRoom.name,
          description: currentChatRoom.description,
          createdBy: {
            name: currentChatRoom.createdBy.name,
            image: currentChatRoom.createdBy.image,
          },
        });
      setIsFavorited((prev) => !prev);
    }
  };

  const renderUserPosts = (userPosts) =>
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, value], i) => (
        <div
          style={{
            display: " flex",
            alignItems: "center",
            marginBlock: "8px",
          }}
          key={i}
        >
          <img
            style={{ borderRadius: "25px" }}
            width={48}
            height={48}
            className="mr-3"
            src={value.image}
            alt={value.name}
          />
          <div style={{ fontWeight: "bold", marginLeft: "7px" }}>
            {key}
            <h6>{value.count} 개</h6>
          </div>
        </div>
      ));

  return (
    <div
      style={{
        width: "100%",
        height: "170px",
        border: ".2rem solid #ececec",
        borderRadius: "4px",
        padding: "1rem ",
        marginBottom: "1rem",
      }}
    >
      <Container>
        <Row>
          <Col>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {isPrivate ? (
                <FaLock style={{ marginRight: "10px" }} />
              ) : (
                <FaLockOpen style={{ marginRight: "10px" }} />
              )}
              {currentChatRoom?.name}{" "}
              {!isPrivate && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleFavorite}
                >
                  {isFavorited ? <ImSmile2 /> : <ImNeutral />}
                </span>
              )}
            </h3>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <FormControl
                onChange={handleSearchChange}
                placeholder="Search Messages"
                aria-label="Search Messages"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {!isPrivate && (
            <p>
              <Image
                src={currentChatRoom && currentChatRoom.createdBy.image}
                roundedCircle
                style={{ width: "30px", height: "30px" }}
              />
              {currentChatRoom && ` ${currentChatRoom.createdBy.name}`}
            </p>
          )}
        </div>
        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: 0 }}>
                  <Accordion.Toggle
                    as={Button}
                    eventKey="0"
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                      border: "none",
                    }}
                  >
                    Description
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {currentChatRoom && currentChatRoom.description}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: "0" }}>
                  <Accordion.Toggle
                    as={Button}
                    eventKey="0"
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                      border: "none",
                    }}
                  >
                    Posts Count
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {userPosts && renderUserPosts(userPosts)}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessagesHeader;
