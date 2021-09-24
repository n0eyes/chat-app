import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  // apiKey: "AIzaSyBTj0kdsQKcIR2AqoWvfn1jQuWxUvE9GRg",
  // authDomain: "chat-app-5aaf1.firebaseapp.com",
  // databaseURL: "https://chat-app-5aaf1.firebaseio.com/",
  // projectId: "chat-app-5aaf1",
  // storageBucket: "chat-app-5aaf1.appspot.com",
  // messagingSenderId: "20959277867",
  // appId: "1:20959277867:web:befc7b8169188f9ac4cb6e",
  // measurementId: "G-ZML02NSZ06",
  apiKey: "AIzaSyBTj0kdsQKcIR2AqoWvfn1jQuWxUvE9GRg",
  authDomain: "chat-app-5aaf1.firebaseapp.com",
  databaseURL: "https://chat-app-5aaf1-default-rtdb.firebaseio.com",
  projectId: "chat-app-5aaf1",
  storageBucket: "chat-app-5aaf1.appspot.com",
  messagingSenderId: "20959277867",
  appId: "1:20959277867:web:befc7b8169188f9ac4cb6e",
  measurementId: "G-ZML02NSZ06",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
export default firebase;
