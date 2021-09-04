export const SET_USER = "SET_USER";
export const SET_LOG_OUT = "SET_LOG_OUT";
export const SET_PHOTO_URL = "SET_PHOTO_URL";
export function setUser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}
export function setLogOut() {
  return {
    type: SET_LOG_OUT,
  };
}

export function setPhotoURL(url) {
  return {
    type: SET_PHOTO_URL,
    payload: url,
  };
}
