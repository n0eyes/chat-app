import React from "react";
import ChatRoom from "./ChatRoom";
import UserPanel from "./UserPanel";
import DirectMessages from "./DirectMessages";
import Favorited from "./Favorited";
function SidePanel() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "#0c8599",
        color: " white",
        padding: "25px",
      }}
    >
      <UserPanel />
      <Favorited />
      <ChatRoom />
      <DirectMessages />
    </div>
  );
}

export default SidePanel;
