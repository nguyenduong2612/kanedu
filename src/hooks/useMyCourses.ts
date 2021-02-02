import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../config/firebaseConfig";
import { setMyCourses } from "../redux/reducers/coursesReducer";

interface RootState {
  user: any;
}

function useMyCourses() {
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getMyCourses() {
      if (!currentUser.user.uid) return;
      const ref = database
        .collection("courses")
        .where("author_id", "==", currentUser.user.uid);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let course = doc.data();
          course.id = doc.id;
          dispatch(setMyCourses(course));
        });
      }
    }

    try {
      getMyCourses();
    } catch (e) {
      console.error(e);
    }
  }, [currentUser.user.uid, dispatch]);
}

export default useMyCourses;
