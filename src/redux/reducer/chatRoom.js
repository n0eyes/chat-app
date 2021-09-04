import { SET_CURRENT_CHAT_ROOM } from "../actions/chatRoom_action";

const initialState = {
  currentChatRoom: null,
};
export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };

    default:
      return state;
  }
}
