import React from "react";
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
import { useSelector } from "react-redux";
function MessagesHeader({ handleSearchChange }) {
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const isPrivate = useSelector((state) => state.chatRoom.isPrivate);
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
            <h3 style={{ display: "flex", alignItems: "center" }}>
              {isPrivate ? (
                <FaLock style={{ marginRight: "10px" }} />
              ) : (
                <FaLockOpen style={{ marginRight: "10px" }} />
              )}
              {currentChatRoom?.name}{" "}
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
          <p>
            <Image src="" />
            username
          </p>
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
                  <Card.Body>Hello! I'm the body</Card.Body>
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
                  <Card.Body>Hello! I'm the body</Card.Body>
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
