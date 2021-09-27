import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRegSmileWink, FaRegWindowClose } from "react-icons/fa";
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
  const addUserListsListener = useCallback(
    (currentUser) => {
      usersRef.on("child_added", (DataSnapshot) => {
        const user = {
          id: DataSnapshot.key,
          name: DataSnapshot.val().name,
        };
        user.id !== currentUser.uid && setUserLists((prev) => [...prev, user]);
      });
    },
    [setUserLists]
  );
  const requestFriend = useCallback((responseUser, currentUser) => {
    usersRef
      .child(currentUser.uid)
      .child(`friends/${responseUser.id}`)
      .update({
        state: "request",
        requestUser: {
          id: currentUser.uid,
          name: currentUser.displayName,
        },
        responseUser: {
          id: responseUser.id,
          name: responseUser.name,
        },
      });
  }, []);
  const removeFriend = useCallback(
    (responseUser, currentUser) => {
      usersRef
        .child(currentUser.uid)
        .child(`friends/${responseUser.id}`)
        .remove();
      const newMyFriendsList = myFriendsList.filter(
        (friend) => friend.key !== responseUser.id
      );
      setMyFriendsList(newMyFriendsList);
    },
    [myFriendsList, setMyFriendsList]
  );
  const renderSearchUsers = useCallback(
    (foundUsers) =>
      foundUsers.map((user) => {
        for (let i = 0; i < myFriendsList.length; i++) {
          if (
            myFriendsList[i].key === user.id &&
            myFriendsList[i].state === "request"
          )
            return (
              <div key={user.id} className="searchUserWrapper">
                <li># {user.name}</li>
                <Button
                  variant="secondary"
                  disabled
                  style={{ padding: 3, fontSize: "12px", fontWeight: "bold" }}
                >
                  수락대기중
                </Button>
              </div>
            );
          else if (
            myFriendsList[i].key === user.id &&
            myFriendsList[i].state === "accept"
          )
            return (
              <div key={user.id} className="searchUserWrapper">
                <li># {user.name}</li>
                <Button
                  variant="danger"
                  style={{ padding: 3, fontSize: "12px", fontWeight: "bold" }}
                  onClick={() => removeFriend(user, currentUser)}
                >
                  친구삭제
                </Button>
              </div>
            );
        }
        return (
          <div key={user.id} className="searchUserWrapper">
            <li># {user.name}</li>
            <Button
              variant="warning"
              style={{ padding: 3, fontSize: "12px", fontWeight: "bold" }}
              onClick={() => requestFriend(user, currentUser)}
            >
              친구신청
            </Button>
          </div>
        );
      }),
    [currentUser, myFriendsList]
  );

  const addFriendsListsListener = useCallback(async () => {
    const usersData = await usersRef.get().then((DataSnapshot) => DataSnapshot);

    usersData.forEach((data) => {
      data.key === currentUser.uid &&
        usersRef
          .child(currentUser.uid)
          .child("friends")
          .on("child_added", (DataSnapshot) => {
            var friend = {
              key: DataSnapshot.key,
              ...DataSnapshot.val(),
            };
            setMyFriendsList((prev) => [...prev, friend]);
          });
    });
  }, [currentUser, setMyFriendsList]);
  useEffect(() => {
    currentUser && addUserListsListener(currentUser);
  }, [addUserListsListener, currentUser]);
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
