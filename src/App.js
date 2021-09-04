import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/actions/user_action";
function App() {
  const history = useHistory();
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  useEffect(async () => {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("변화 감지!");
        dispatch(setUser(user));
        history.push("/");
        // firebase.auth().signOut();
      } else {
        history.push("/login");
      }
    });
  }, []);
  console.log("App 렌더링");
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
