import {
  SET_CURRENT_CHAT_ROOM,
  SET_IS_PRIVATE,
} from "../actions/chatRoom_action";

const initialState = {
  currentChatRoom: null,
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
    default:
      return state;
  }
}
