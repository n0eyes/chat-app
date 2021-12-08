import React from "react";
import ChatRoom from "./ChatRoom";
import UserPanel from "./UserPanel";
import DirectMessages from "./DirectMessages";
import Favorited from "./Favorited";
import UserSearch from "./UserSearch";
import styled from "styled-components";
function SidePanel() {
  return (
    <>
      <SidePanelWrapper>
        <UserPanel />
        <Favorited />
        <ChatRoom />
        <DirectMessages />
        <UserSearch />
      </SidePanelWrapper>
    </>
  );
}

const SidePanelWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0c8599;
  color: white;
  padding: 25px;
  overflow: scroll;
`;

export default SidePanel;
