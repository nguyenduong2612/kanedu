import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../config/firebaseConfig";
import { setFavoritePost } from "../redux/reducers/postsReducer";

interface RootState {
  user: any;
}

function useFavoritePosts() {
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getFavoritePosts() {
      if (!currentUser.user.uid) return;
      const ref = database.collection("users").doc(currentUser.user.uid);
      const doc: any = await ref.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        if (!doc.data().favorite_posts) return;
        doc.data().favorite_posts.forEach((postId: string) => {
          dispatch(setFavoritePost(postId));
        });
      }
    }

    try {
      getFavoritePosts();
    } catch (e) {
      console.error(e);
    }
  }, [currentUser.user.uid, dispatch]);
}

export default useFavoritePosts;
