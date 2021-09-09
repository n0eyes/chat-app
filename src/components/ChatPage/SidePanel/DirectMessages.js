import React, { Component } from "react";
import { FaRegSmile } from "react-icons/fa";
export class DirectMessages extends Component {
  renderDirectMessages = () => {
    return (
      <li
        style={{ paddingLeft: 5, cursor: "pointer", borderRadius: "5px" }}
      >{`# 세연`}</li>
    );
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FaRegSmile />
          {`DIRECT MESSAGES (1)`}
          <div />
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderDirectMessages()}
        </ul>
      </div>
    );
  }
}

export default DirectMessages;
