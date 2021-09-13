import {
  SET_CURRENT_CHAT_ROOM,
  SET_IS_PRIVATE,
  SET_IMAGE_REF_IN_MESSAGES,
  SET_LOAD_MESSAGES,
} from "../actions/chatRoom_action";

const initialState = {
  currentChatRoom: null,
  messages: [],
  isPrivate: false,
};
export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };
    case SET_IS_PRIVATE:
      return {
        ...state,
        isPrivate: action.payload,
      };
    case SET_IMAGE_REF_IN_MESSAGES:
      console.log("state", state.messages);
      return {
        ...state,
      };
    case SET_LOAD_MESSAGES:
      return {
        ...state,
        messages: [...action.payload],
      };
    default:
      return state;
  }
}
