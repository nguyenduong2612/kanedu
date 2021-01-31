import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database, storage } from "../../config/firebaseConfig";

interface RootState {
  posts: any;
}

function usePost(postId: string) {
  const [postData, setPostData] = useState<any>();
  const [profileURL, setProfileURL] = useState<string>("");
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);
  const [commentList, setCommentList] = useState<any[]>([]);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const favoritePosts = useSelector(
    (state: RootState) => state.posts.favoritePosts
  );
  const postList = useSelector((state: RootState) => state.posts).allPosts;

  useEffect(() => {
    function getPostData() {
      let postData = postList.find(
        (p: any) => p.id === postId
      );
      setPostData(postData.data);
    }

    getPostData();
  }, [postList, postId]);

  useEffect(() => {
    async function getProfileURL() {
      const storageRef = storage.ref();

      const fileName = `${postData.author_id}`;
      const fileRef = storageRef.child("users_avatar/" + fileName);

      setProfileURL(await fileRef.getDownloadURL());
    }

    if (favoritePosts.includes(postId)) setIsFavorited(true);

    async function getAllComment() {
      const ref = database
        .collection("posts")
        .doc(postId)
        .collection("comments");
      const docs = await ref.orderBy("created_at").get();
      if (docs.empty) {
        return
      } else {
        docs.forEach((doc) => {
          setCommentList((commentList) => [
            ...commentList,
            { data: doc.data(), id: doc.id },
          ]);
        });
      }
    }

    if (!postData) return

    getProfileURL();
    getAllComment();

    setLikes(postData.likes);
    setComments(postData.comments);
  }, [postData, favoritePosts, postId])

  return {
    postData,
    setPostData,
    profileURL,
    setProfileURL,
    isFavorited,
    setIsFavorited,
    likes,
    setLikes,
    comments,
    setComments,
    commentList,
    setCommentList
  };
}

export default usePost;
