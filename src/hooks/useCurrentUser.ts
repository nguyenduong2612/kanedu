import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../config/firebaseConfig";
import { onAuthStateChanged } from "../helpers/firebaseHelper";

import {
  setCurrentUserFailed,
  setCurrentUserStarted,
  setCurrentUserSuccess,
} from "../redux/user/user.actions";

interface RootState {
  user: any;
}

function useCurrentUser() {
  const { user, isLoggedin, isLoading } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentUserStarted());
    onAuthStateChanged().then(async (user: any) => {
      if (user) {
        //window.history.replaceState({}, '', '/')
        const doc: any = await database.collection("users").doc(user.uid).get();
        const cardStatusSnap: any = await database
          .collection("users")
          .doc(user.uid)
          .collection("cardStatus")
          .get();
        if (!doc.exists) {
          console.log("Can't find user");
        } else {
          let currentUser = doc.data();
          currentUser.uid = doc.id;
          currentUser.verified = user.emailVerified;
          currentUser.cardStatus = await Promise.all(
            cardStatusSnap.docs.map(async (card: any) => ({
              id: card.id,
              ...card.data(),
            }))
          );

          dispatch(setCurrentUserSuccess(currentUser));
        }
      } else {
        dispatch(setCurrentUserFailed());
        //window.history.replaceState({}, "", "/welcome");
      }
    });
  }, [user.uid, dispatch]);

  return {
    isLoading,
    isLoggedin,
    user,
  };
}

export default useCurrentUser;
