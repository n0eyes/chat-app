import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRegSmileWink } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import firebase from "firebase";

function UserSearch() {
  const [searchUser, setSearchUser] = useState();
  const [userLists, setUserLists] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);
  const [myFriendsList, setMyFriendsList] = useState([]);
  const usersRef = firebase.database().ref("user");
  const currentUser = useSelector((state) => state.user.currentUser);

  const searchFormHandler = useCallback(
    (e) => setSearchUser(e.currentTarget.value),
    [setSearchUser]
  );
  const searchClickHandler = useCallback(() => {
    const usersForSearch = [...userLists];
    const regex = new RegExp(searchUser, "gi");
    const foundUsers = usersForSearch.reduce((acc, user) => {
      user && user.name.match(regex) && acc.push(user);
      return acc;
    }, []);
    setFoundUsers(foundUsers);
  }, [userLists, searchUser, setFoundUsers]);
  const addUserListsListener = useCallback(() => {
    usersRef.on("child_added", (DataSnapshot) => {
      const user = {
        id: DataSnapshot.key,
        name: DataSnapshot.val().name,
      };
      setUserLists((prev) => [...prev, user]);
    });
  }, [setUserLists]);
  const renderSearchUsers = useCallback((foundUsers) => {
    return foundUsers.map((user) => (
      <div key={user.id} className="searchUserWrapper">
        <li># {user.name}</li>
        <Button
          variant="warning"
          style={{ padding: 3, fontSize: "12px", fontWeight: "bold" }}
        >
          친구신청
        </Button>
      </div>
    ));
  }, []);
  // {
  //   state: loading
  //   request: userid , id
  //   response: userid , id
  // }
  const addFriendsListsListener = useCallback(async () => {
    const usersData = await usersRef.get().then((DataSnapshot) => DataSnapshot);

    usersData.forEach((data) => {
      data.key === currentUser.uid &&
        usersRef
          .child(currentUser.uid)
          .child("friends")
          .on("child_added", (DataSnapshot) => {
            setMyFriendsList((prev) => [...prev, DataSnapshot.val()]);
          });
    });
  }, [currentUser, setMyFriendsList]);
  useEffect(() => {
    addUserListsListener();
  }, [addUserListsListener]);
  useEffect(() => {
    currentUser && addFriendsListsListener();
  }, [addFriendsListsListener, currentUser]);
  return (
    <UserSearchWrapper>
      <div className="serachUserHeader">
        <FaRegSmileWink style={{ marginRight: "11px", marginTop: "2px" }} />
        {`SEARCH USER `}
      </div>
      <div className="searchFromWrapper">
        <input
          className="userSearchInput"
          value={searchUser || ""}
          onChange={searchFormHandler}
        />
        <BsSearch
          style={{ cursor: "pointer", marginLeft: "5px" }}
          onClick={searchClickHandler}
        />
      </div>
      <ul className="searchUserLists">{renderSearchUsers(foundUsers)}</ul>
    </UserSearchWrapper>
  );
}
const UserSearchWrapper = styled.div`
  .userSearchInput {
    border: none;
    border-bottom: 1px solid white;
    background-color: transparent;
    color: white;
    margin-bottom: 10px;
    &:focus {
      outline: none;
    }
  }
  .serachUserHeader {
    display: flex;
    align-items: center;
  }
  .searchFromWrapper {
    display: flex;
    align-items: center;
  }
  .searchUserLists {
    list-style-type: none;
    padding: 0;
  }
  .searchUserWrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
`;
export default UserSearch;
