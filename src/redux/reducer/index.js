import { combineReducers } from "redux";
import user from "./user";
// import chatRoom from './chatRoom_reducer';

const rootReducer = combineReducers({
  user,
  // chatRoom
});

export default rootReducer;
