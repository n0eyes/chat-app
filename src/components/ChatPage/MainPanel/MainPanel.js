import React, { Component } from "react";
import Messages from "./Messages";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
export class MainPanel extends Component {
  render() {
    return (
      <div style={{ padding: "25px" }}>
        <MessagesHeader />
        <div
          style={{
            border: "2px solid #ececec",
            width: "100%",
            height: "40vh",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        ></div>
        <MessagesForm />
      </div>
    );
  }
}

export default MainPanel;
