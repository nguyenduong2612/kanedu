import { signoutUser } from "../../helpers/firebaseHelper";
import { store } from "../store";
import {
  SET_CURRENT_USER_FAILED,
  SET_CURRENT_USER_STARTED,
  SET_CURRENT_USER_SUCCESS,
  SIGN_OUT_USER_SUCCESS,
} from "./user.types";

export const setCurrentUserStarted = () => ({
  type: SET_CURRENT_USER_STARTED,
});

export const setCurrentUserSuccess = (currentUser: any) => ({
  type: SET_CURRENT_USER_SUCCESS,
  payload: currentUser,
});

export const setCurrentUserFailed = () => ({
  type: SET_CURRENT_USER_FAILED,
});


export const signOutUser = () => {
  const signOutUserSuccess = () => ({
    type: SIGN_OUT_USER_SUCCESS,
  });

  return async (dispatch: typeof store.dispatch) => {
    try {
      await signoutUser()
      dispatch(signOutUserSuccess());
    } catch (error) {
      console.error(error)
    }
  };
};
