import { database } from "../../config/firebaseConfig";
import { signoutUser } from "../../helpers/firebaseHelper";
import { store } from "../store";
import {
  SET_CARD_STATUS_SUCCESS,
  SET_CURRENT_USER_FAILED,
  SET_CURRENT_USER_STARTED,
  SET_CURRENT_USER_SUCCESS,
  SET_REMINDER_SUCCESS,
  SIGN_OUT_USER_SUCCESS,
  UPDATE_CARD_STATUS_SUCCESS,
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
      await signoutUser();
      dispatch(signOutUserSuccess());
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateCardStatus = (
  user: any,
  cardId: string,
  lessonId: string,
  status: string
) => {
  const updateCardStatusSuccess = (cardIndex: number, status: string) => ({
    type: UPDATE_CARD_STATUS_SUCCESS,
    payload: cardIndex,
    status: status,
  });
  const setCardStatusSuccess = (cardStatus: any) => ({
    type: SET_CARD_STATUS_SUCCESS,
    payload: cardStatus,
  });

  return async (dispatch: typeof store.dispatch) => {
    try {
      let cardRef: any = database
        .collection("users")
        .doc(user.uid)
        .collection("cardStatus")
        .doc(cardId);
      await cardRef.set({ lessonId, status });

      let cardIndex = user.cardStatus.findIndex(
        (card: any) => card.id === cardId
      );

      if (cardIndex === -1) {
        let newCardStatus = {
          id: cardId,
          lessonId,
          status,
        };
        dispatch(setCardStatusSuccess(newCardStatus));
      } else {
        dispatch(updateCardStatusSuccess(cardIndex, status));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const setReminder = (userId: string, reminder: object) => {
  const setReminderSuccess = (reminder: object) => ({
    type: SET_REMINDER_SUCCESS,
    payload: reminder,
  });

  return async (dispatch: typeof store.dispatch) => {
    try {
      console.log(reminder)
      let ref: any = database.collection("users").doc(userId);
      await ref.set({ reminder });

      dispatch(setReminderSuccess(reminder));
    } catch (error) {
      console.error(error);
    }
  };
};
