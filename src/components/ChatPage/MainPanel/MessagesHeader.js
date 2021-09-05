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
import { FaLock } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

function MessagesHeader() {
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
            <h3>
              <FaLock /> ChatRoomName <MdFavorite />
            </h3>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <FormControl
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
