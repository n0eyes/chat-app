export const SET_CURRENT_CHAT_ROOM = "SET_CURRENT_CHAT_ROOM";
export const SET_IS_PRIVATE = "SET_IS_PRIVATE";

export function setCurrentChatRoom(currentChatRoom) {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: currentChatRoom,
  };
}
export function setIsPrivate(payload) {
  return {
    type: SET_IS_PRIVATE,
    payload,
  };
}
