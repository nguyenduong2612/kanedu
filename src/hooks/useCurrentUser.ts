import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database, getCurrentUser } from "../config/firebaseConfig";

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
          let currentUser = {
            uid: doc.id,
            email: doc.data().email,
            name: doc.data().name,
            birthday: doc.data().birthday,
            profileURL: doc.data().profileURL,
            verified: user.emailVerified,
          };
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
    user
  }
}

export default useCurrentUser;
