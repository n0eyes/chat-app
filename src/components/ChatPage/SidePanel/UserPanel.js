import React, { useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { setLogOut, setPhotoURL } from "../../../redux/actions/user_action";
import { setImageRefInCurrentChatRoom } from "../../../redux/actions/chatRoom_action";
import { IoIosChatboxes } from "react-icons/io";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import mime from "mime-types";
import styled from "styled-components";
import firebase from "firebase";
function UserPanel() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const messagesRef = firebase.database().ref("messages");
  const chatRoomsRef = firebase.database().ref("chatRooms");
  const imageUploadRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogOut = useCallback(() => {
    firebase.auth().signOut();
    localStorage.removeItem("userInfo");
    dispatch(setLogOut());
    history.push("/login");
  }, [dispatch, history]);
  const onUploadImage = useCallback(() => {
    imageUploadRef.current.click();
  }, [imageUploadRef]);

  const onUploadImgToDb = useCallback(
    async (e) => {
      //파일 찾아서
      const file = e.target.files[0];
      //모듈로 타입 추출
      const metadata = { contentType: mime.lookup(file.name) };
      //스토리지에 저장 // mime은 파일을 넣으면 파일의 타입을 알려주는 라이브러리
      try {
        const userImageSnapShot = await firebase
          .storage()
          .ref("userImages")
          .child(`${currentUser.uid}/${file.name}`)
          .put(file, metadata);
        const downloadURL = await userImageSnapShot.ref.getDownloadURL();

        //auth 현재 유저 정보의 포토 URL 수정
        await firebase.auth().currentUser.updateProfile({
          photoURL: downloadURL,
        });

        //db message 테이블의 URL 수정
        const needChangeInMessageRef = [];
        messagesRef.child(currentChatRoom.id).on("value", (DataSnapshot) => {
          DataSnapshot.forEach((data) => {
            data.val().user.id === currentUser.uid &&
              needChangeInMessageRef.push({
                id: data.val().user.id,
                key: data.key,
                downloadURL,
              });
          });
        });
        needChangeInMessageRef.forEach(async (data) => {
          await messagesRef
            .child(`${currentChatRoom.id}/${data.key}/user`)
            .update({
              image: data.downloadURL,
            });
        });
        messagesRef.child(currentChatRoom.id).off();

        //db chatRoom 테이블의 URL 수정
        const needChangeInChatRoomsRef = [];
        chatRoomsRef.on("value", (DataSnapshot) => {
          DataSnapshot.forEach((data) => {
            data.val().createdBy.name === currentUser.displayName &&
              needChangeInChatRoomsRef.push({
                chatRoomId: data.val().id,
                downloadURL,
              });
          });
        });
        needChangeInChatRoomsRef.forEach(async (data) => {
          await chatRoomsRef.child(`${data.chatRoomId}/createdBy`).update({
            image: data.downloadURL,
          });
        });
        //데이터 베이스의 이미지 정보 수정
        await firebase.database().ref("user").child(currentUser.uid).update({
          image: downloadURL,
        });
        //state.user.currentUesr 프로필 이미지 수정
        dispatch(setPhotoURL(downloadURL));

        //state.chatRoom.currentChatRoom의 생성자 이미지 링크 수정
        dispatch(setImageRefInCurrentChatRoom({ downloadURL }));
      } catch (err) {
        console.log(err);
      }
    },
    [currentUser, currentChatRoom, messagesRef, chatRoomsRef, dispatch]
  );
  return (
    <UserPanelWrapper>
      {/* <-- Logo --> */}
      <h3>
        <IoIosChatboxes />
        {` Chat App`}
      </h3>
      <div className="userPanel">
        <ImageWrapper src={currentUser?.photoURL} roundedCircle />
        <Dropdown>
          <ToggleWrapper
            id="dropdown-basic"
            style={{
              background: "transparent",
              border: "0",
            }}
          >
            {currentUser?.displayName}
          </ToggleWrapper>

          <Dropdown.Menu>
            <Dropdown.Item onClick={onUploadImage}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={onLogOut}>
              로그아웃
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <input
        className="imageUploadInput"
        type="file"
        accept="image/jpeg, image/png"
        ref={imageUploadRef}
        onChange={onUploadImgToDb}
      />
    </UserPanelWrapper>
  );
}
const UserPanelWrapper = styled.div`
  .userPanel {
    display: flex;
  }
  .imageUploadInput {
    display: none;
  }
  .userProfileImage {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
  .userProfileDropdown {
    background: transparent;
    border: 0;
  }
`;
const ToggleWrapper = styled(Dropdown.Toggle)`
  background: transparent;
  border: 0;
`;
const ImageWrapper = styled(Image)`
  width: 30px;
  height: 30px;
  margin-right: 5px;
`;
export default UserPanel;
