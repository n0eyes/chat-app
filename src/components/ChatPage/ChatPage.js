import React from "react";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import { useSelector } from "react-redux";
function ChatPage() {
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  return (
    <div style={{ display: "flex", flexBasis: "300px" }}>
      <div style={{ width: "15vw" }}>
        <SidePanel></SidePanel>
      </div>
      <div style={{ width: "85vw" }}>
        <MainPanel key={currentChatRoom?.id}></MainPanel>
      </div>
    </div>
  );
}

export default ChatPage;
