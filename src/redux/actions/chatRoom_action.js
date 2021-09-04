export const SET_CURRENT_CHAT_ROOM = "SET_CURRENT_CHAT_ROOM";

export function setCurrentChatRoom(currentChatRoom) {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: currentChatRoom,
  };
}
