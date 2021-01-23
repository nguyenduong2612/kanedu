import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { storage } from "../../config/firebaseConfig";

interface RootState {
  posts: any;
}

function usePost(post: any) {
  const [profileURL, setProfileURL] = useState<string>("");
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const id = post.id;
  const data = post.data;

  const favoritePosts = useSelector(
    (state: RootState) => state.posts.favoritePosts
  );

  useEffect(() => {
    async function getProfileURL() {
      const storageRef = storage.ref();

      const fileName = `${post.data.author_id}`;
      const fileRef = storageRef.child("users_avatar/" + fileName);

      setProfileURL(await fileRef.getDownloadURL());
    }

    if (favoritePosts.includes(post.id)) setIsFavorited(true);

    getProfileURL();

    setLikes(post.data.likes);
    setComments(post.data.comments);
  }, [favoritePosts, post.id, post.data]);

  return {
    id,
    data,
    profileURL,
    setProfileURL,
    isFavorited,
    setIsFavorited,
    likes,
    setLikes,
    comments,
    setComments,
  };
}

export default usePost;
