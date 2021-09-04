import React from "react";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import { useDispatch } from "react-redux";
function ChatPage() {
  const dispatch = useDispatch();
  return (
    <div style={{ display: "flex", flexBasis: "300px" }}>
      <div style={{ width: "15vw" }}>
        <SidePanel></SidePanel>
      </div>
      <div style={{ width: "85vw" }}>
        <MainPanel></MainPanel>
      </div>
    </div>
  );
}

export default ChatPage;
