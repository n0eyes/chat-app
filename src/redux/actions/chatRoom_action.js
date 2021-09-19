export const SET_CURRENT_CHAT_ROOM = "SET_CURRENT_CHAT_ROOM";
export const SET_IS_PRIVATE = "SET_IS_PRIVATE";
export const SET_IMAGE_REF_IN_MESSAGES = "SET_IMAGE_REF_IN_MESSAGES";
export const SET_LOAD_MESSAGES = "SET_LOAD_MESSAGES";
export const SET_IMAGE_REF_CURRENT_CHATROOM = "SET_IMAGE_REF_CURRENT_CHATROOM";
export const SET_USER_POSTS = "SET_USER_POSTS";
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
export function setImageRefInMessges(payload) {
  return {
    type: SET_IMAGE_REF_IN_MESSAGES,
    payload,
  };
}
export function setImageRefInCurrentChatRoom(payload) {
  return {
    type: SET_IMAGE_REF_CURRENT_CHATROOM,
    payload,
  };
}
export function setLoadMessges(payload) {
  return {
    type: SET_LOAD_MESSAGES,
    payload,
  };
}
export function setUserPosts(payload) {
  return {
    type: SET_USER_POSTS,
    payload,
  };
}
