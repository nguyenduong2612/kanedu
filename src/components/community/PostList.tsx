import React, { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";
import Post from "./Post";

interface ContainerProps {}

const PostList: React.FC<ContainerProps> = () => {
  const [postList, setPostList] = useState<any[]>([]);

  useEffect(() => {
    async function getAllPost() {
      const ref = database.collection("posts");
      const docs = await ref.orderBy("created_at", "desc").get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setPostList((postList) => [...postList, doc]);
        });
      }
    }

    getAllPost();
  }, []);

  return (
    <div style={{ paddingTop: 10 }}>
      {postList.map((post: any, index: number) => {
        return <Post key={index} post={post} />;
      })}
    </div>
  );
};

export default PostList;
