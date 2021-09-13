import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/actions/user_action";
import firebase from "firebase";
function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        history.push("/");
        dispatch(setUser(currentUser));
      } else {
        history.push("login");
      }
    });
  }, []);
  if (isLoading) {
    return <div>로딩중...</div>;
  } else {
    return (
      <Switch>
        <Route exact path="/" component={ChatPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    );
  }
}

export default App;
