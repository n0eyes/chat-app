import {
  SET_CURRENT_CHAT_ROOM,
  SET_IS_PRIVATE,
  SET_IMAGE_REF_CURRENT_CHATROOM,
  SET_LOAD_MESSAGES,
  SET_USER_POSTS,
} from "../actions/chatRoom_action";

const initialState = {
  currentChatRoom: null,
  userPosts: {},
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

    case SET_IMAGE_REF_CURRENT_CHATROOM:
      //immer는 나중에 넣자
      return {
        ...state,
        currentChatRoom: {
          ...state.currentChatRoom,
          createdBy: {
            ...state.currentChatRoom.createdBy,
            image: action.payload.downloadURL,
          },
        },
      };
    case SET_LOAD_MESSAGES:
      return {
        ...state,
        messages: [...action.payload],
      };
    case SET_USER_POSTS:
      return {
        ...state,
        userPosts: { ...action.payload },
      };
    default:
      return state;
  }
}
