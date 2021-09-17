import React, { useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosChatboxes } from "react-icons/io";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import firebase from "firebase";
import { setLogOut, setPhotoURL } from "../../../redux/actions/user_action";
import { useHistory } from "react-router";
import mime from "mime-types";
import { setImageRefInMessges } from "../../../redux/actions/chatRoom_action";
function UserPanel() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const messagesRef = firebase.database().ref("messages");
  const imageUploadRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogOut = useCallback(() => {
    firebase.auth().signOut();
    localStorage.removeItem("userInfo");
    dispatch(setLogOut());
    history.push("/login");
  }, []);
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

        //유저 정보의 포토 URL 수정
        await firebase.auth().currentUser.updateProfile({
          photoURL: downloadURL,
        });

        const needChangeData = [];
        messagesRef.child(currentChatRoom.id).on("value", (DataSnapshot) => {
          DataSnapshot.forEach((data) => {
            data.val().user.id === currentUser.uid &&
              needChangeData.push({
                id: data.val().user.id,
                key: data.key,
                downloadURL,
              });
          });
        });
        messagesRef.child(currentChatRoom.id).off();
        //db imageRef 전부 수정
        needChangeData.forEach(async (data) => {
          await messagesRef
            .child(`${currentChatRoom.id}/${data.key}/user`)
            .update({
              image: data.downloadURL,
            });
        });
        //state.user.currentUesr 프로필 이미지 수정
        dispatch(setPhotoURL(downloadURL));

        //state.chatRoom.messages 모든 이미지 링크 수정
        dispatch(
          setImageRefInMessges({ currentUserId: currentUser.uid, downloadURL })
        );
        //데이터 베이스의 이미지 정보 수정
        await firebase.database().ref("user").child(currentUser.uid).update({
          image: downloadURL,
        });
      } catch (err) {
        console.log(err);
      }
    },
    [currentUser, currentChatRoom, messagesRef]
  );
  return (
    <div>
      {/* <-- Logo --> */}
      <h3>
        <IoIosChatboxes />
        {` Chat App`}
      </h3>
      <div style={{ display: "flex" }}>
        <Image
          src={currentUser?.photoURL}
          roundedCircle
          style={{ width: 30, height: 30, marginRight: 5 }}
        />
        <Dropdown>
          <Dropdown.Toggle
            id="dropdown-basic"
            style={{
              background: "transparent",
              border: "0",
            }}
          >
            {currentUser?.displayName}
          </Dropdown.Toggle>

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
        style={{ display: "none" }}
        type="file"
        accept="image/jpeg, image/png"
        ref={imageUploadRef}
        onChange={onUploadImgToDb}
      />
    </div>
  );
}

export default UserPanel;
