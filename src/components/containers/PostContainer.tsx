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
  IonRouterLink,
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
  postId: string;
  username: string;
}

interface RootState {
  user: any;
  posts: any;
}

const PostContainer: React.FC<PostContainerProps> = ({ postId, username }) => {
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

  const currentUser = useSelector((state: RootState) => state.user);
  const post = usePost(postId);

  const handleSendComment = async (commentInput: string) => {
    if (commentInput.trim() === "") return;
    let comment = {
      author: username,
      content: commentInput,
      created_at: Date.now(),
    };

    const res = await database
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .add(comment);

    let postRef = database.collection("posts").doc(postId);
    postRef.update({
      comments: firebase.firestore.FieldValue.increment(1),
    });

    post.setCommentList((commentList) => [
      ...commentList,
      { data: comment, id: res.id },
    ]);
    post.setComments(post.comments + 1);
  };

  const handleShowModal = () => {
    setShowCommentModal(true);
  };

  const handleCloseModal = () => {
    setShowCommentModal(false);
  };

  const handleLikePost = () => {
    post.setIsFavorited(true);
    post.setLikes(post.likes + 1);
    //dispatch(setFavoritePost(post.id));

    let userRef = database.collection("users").doc(currentUser.user.uid);
    userRef.update({
      favorite_posts: firebase.firestore.FieldValue.arrayUnion(postId),
    });

    let postRef = database.collection("posts").doc(postId);
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
      favorite_posts: firebase.firestore.FieldValue.arrayRemove(postId),
    });

    let postRef = database.collection("posts").doc(postId);
    postRef.update({
      likes: firebase.firestore.FieldValue.increment(-1),
    });
  };

  return (
    <div>
      {post.postData && (
        <IonCard className="post-wrapper">
          <IonCardHeader>
            <IonText style={{ fontSize: 16, color: "black" }}>
              {post.postData.title}
            </IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonRouterLink
              className="post-content"
              routerLink={`/community/${postId}`}
            >
              <IonRow className="post-info">
                <div>
                  <img
                    alt="avatar"
                    style={{ borderRadius: "50%", width: "95%", maxWidth: 50 }}
                    src={post.profileURL}
                  />
                </div>
                <div style={{ paddingLeft: 10 }}>
                  <p>{post.postData.author}</p>
                  <p>
                    {moment(post.postData.created_at).locale("vi").fromNow()}
                  </p>
                </div>
              </IonRow>

              <IonRow>
                <p className="post-text">{post.postData.content}</p>
                <br></br>
                {post.postData.sharedLink && (
                  <IonButton href={post.postData.sharedLink} fill="outline">
                    Tham gia
                  </IonButton>
                )}
              </IonRow>
            </IonRouterLink>
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
                commentList={post.commentList}
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
      )}
    </div>
  );
};

export default PostContainer;
