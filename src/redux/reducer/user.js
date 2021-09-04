import { SET_USER, SET_LOG_OUT, SET_PHOTO_URL } from "../actions/user_action";

const initialState = {
  currentUser: null,
  isLoading: false,
  test: null,
};
export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case SET_LOG_OUT:
      return {
        ...state,
        currentUser: null,
      };
    case SET_PHOTO_URL:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          photoURL: action.payload,
        },
      };
    default:
      return state;
  }
}
