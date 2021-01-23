import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonText,
  IonLabel,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
} from "@ionic/react";
import * as firebase from "firebase/app";
import { chatboxOutline, heartOutline, heartSharp } from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../../config/firebaseConfig";
import usePost from "../../hooks/community/usePost";
import CommentsModal from "../modals/CommentsModal";
import "./PostContainer.scss";

interface PostContainerProps {
  key: number;
  postData: any;
  username: string;
}

interface RootState {
  user: any;
  posts: any;
}

const PostContainer: React.FC<PostContainerProps> = ({
  postData,
  username,
}) => {
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

  const [commentList, setCommentList] = useState<any[]>([]);

  const currentUser = useSelector((state: RootState) => state.user);
  const post = usePost(postData);

  const handleSendComment = async (commentInput: string) => {
    if (commentInput.trim() === "") return;
    let comment = {
      author: username,
      content: commentInput,
      created_at: Date.now(),
    };

    const res = await database
      .collection("posts")
      .doc(post.id)
      .collection("comments")
      .add(comment);

    let postRef = database.collection("posts").doc(post.id);
    postRef.update({
      comments: firebase.firestore.FieldValue.increment(1),
    });

    setCommentList((commentList) => [
      ...commentList,
      { data: comment, id: res.id },
    ]);
    post.setComments(post.comments + 1);
  };

  const handleShowModal = () => {
    setShowCommentModal(true);
    getAllComment();
  };

  const handleCloseModal = () => {
    setShowCommentModal(false);
    setCommentList([]);
  };

  const handleLikePost = () => {
    post.setIsFavorited(true);
    post.setLikes(post.likes + 1);
    //dispatch(setFavoritePost(post.id));

    let userRef = database.collection("users").doc(currentUser.user.uid);
    userRef.update({
      favorite_posts: firebase.firestore.FieldValue.arrayUnion(post.id),
    });

    let postRef = database.collection("posts").doc(post.id);
    postRef.update({
      likes: firebase.firestore.FieldValue.increment(1),
    });
  };

  const handleUnlikePost = () => {
    post.setIsFavorited(false);
    post.setLikes(post.likes - 1);
    //dispatch(setFavoritePost(post.id));

    let ref = database.collection("users").doc(currentUser.user.uid);
    ref.update({
      favorite_posts: firebase.firestore.FieldValue.arrayRemove(post.id),
    });

    let postRef = database.collection("posts").doc(post.id);
    postRef.update({
      likes: firebase.firestore.FieldValue.increment(-1),
    });
  };

  async function getAllComment() {
    const ref = database
      .collection("posts")
      .doc(post.id)
      .collection("comments");
    const docs = await ref.orderBy("created_at").get();
    if (docs.empty) {
      console.log("No such document!");
    } else {
      docs.forEach((doc) => {
        setCommentList((commentList) => [
          ...commentList,
          { data: doc.data(), id: doc.id },
        ]);
      });
    }
  }

  return (
    <div>
      <IonCard
        className="post-wrapper"
        /*routerLink={`/community/${post.id}`}*/
      >
        <IonCardHeader>
          <IonText style={{ fontSize: 20, color: "black" }}>
            {post.data.title}
          </IonText>
        </IonCardHeader>
        <IonCardContent>
          <IonRow>
            <div>
              <img
                alt="avatar"
                style={{ borderRadius: "50%", width: "95%", maxWidth: 50 }}
                src={post.profileURL}
              />
            </div>
            <div style={{ paddingLeft: 10 }}>
              <p>{post.data.author}</p>
              <p>{moment(post.data.created_at).locale("vi").fromNow()}</p>
            </div>
          </IonRow>

          <IonRow>
            <p className="post-content">{post.data.content}</p>
            <br></br>
            {post.data.sharedLink && (
              <IonButton href={post.data.sharedLink} fill="outline">
                Tham gia
              </IonButton>
            )}
          </IonRow>
        </IonCardContent>

        <IonRow style={{ borderTop: "1px solid #bbb", margin: "0 15px" }}>
          <IonCol size="6">
            <IonButton
              size="default"
              style={{ width: "100%", fontSize: 12 }}
              color="dark"
              fill="clear"
              onClick={post.isFavorited ? handleUnlikePost : handleLikePost}
            >
              {post.isFavorited ? (
                <IonIcon color="primary" slot="icon-only" icon={heartSharp} />
              ) : (
                <IonIcon slot="icon-only" icon={heartOutline} />
              )}
              <IonLabel style={{ paddingLeft: 7, overflow: "unset" }}>
                ({post.likes}) Yêu thích
              </IonLabel>
            </IonButton>
          </IonCol>

          <IonCol size="6">
            <CommentsModal
              isOpen={showCommentModal}
              commentCount={post.comments}
              commentList={commentList}
              handleCloseModal={handleCloseModal}
              handleSendComment={handleSendComment}
            />

            <IonButton
              size="default"
              style={{ width: "100%", fontSize: 12 }}
              color="dark"
              fill="clear"
              onClick={handleShowModal}
            >
              <IonIcon slot="icon-only" icon={chatboxOutline} />
              <IonLabel style={{ paddingLeft: 7, overflow: "unset" }}>
                ({post.comments}) Bình luận
              </IonLabel>
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCard>
    </div>
  );
};

export default PostContainer;
