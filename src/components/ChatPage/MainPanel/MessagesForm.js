import React from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//커밋 오류로 인한 재커밋
function MessagesForm() {
  return (
    <div>
      <Form>
        <Form.Group controlid="">
          <Form.Control as="textarea" row={3}></Form.Control>
        </Form.Group>
      </Form>

      <ProgressBar now={60} variant="warning" />

      <Row>
        <Col>
          <button className="message-form-button" style={{ width: "100%" }}>
            SEND
          </button>
        </Col>
        <Col>
          <button className="message-form-button" style={{ width: "100%" }}>
            SEND
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default MessagesForm;
