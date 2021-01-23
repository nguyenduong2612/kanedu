import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../config/firebaseConfig";
import { setFollowingCourses } from "../redux/reducers/coursesReducer";

interface RootState {
  user: any;
}

function useFollowingCourses() {
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getFollowingCourses() {
      if (!currentUser.user.uid) return;
      const ref = database
        .collection("courses")
        .where("followed_by", "array-contains", currentUser.user.uid);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let course = {
            id: doc.id,
            author: doc.data().author,
            author_id: doc.data().author_id,
            name: doc.data().name,
            description: doc.data().description,
            followers: doc.data().followed_by?.length,
          };
          dispatch(setFollowingCourses(course));
        });
      }
    }

    try {
      getFollowingCourses();
    } catch (e) {
      console.error(e);
    }
  }, [currentUser.user.uid, dispatch]);
}

export default useFollowingCourses;
