import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../config/firebaseConfig";
import { getCurrentUser } from "../helpers/firebaseHelper";

import { setCurrentUser } from "../redux/reducers/userReducer";

interface RootState {
  user: any;
}

function useCurrentUser() {
  const [busy, setBusy] = useState<boolean>(true);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser().then(async (user: any) => {
      //console.log(user)
      if (user) {
        //window.history.replaceState({}, '', '/')
        const doc: any = await database.collection("users").doc(user.uid).get();
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          let currentUser = doc.data();
          currentUser.uid = doc.id;
          currentUser.verified = user.emailVerified;
          dispatch(setCurrentUser(currentUser));
        }
      } else {
        window.history.replaceState({}, "", "/welcome");
      }
      setBusy(false);
    });
  }, [user.user.uid, dispatch]);

  return {
    busy,
    setBusy,
    user,
  };
}

export default useCurrentUser;
