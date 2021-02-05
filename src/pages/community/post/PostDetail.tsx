import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonInput,
  IonItem,
} from "@ionic/react";
import * as firebase from "firebase/app";
import {
  chatboxOutline,
  heartOutline,
  heartSharp,
  sendOutline,
  sendSharp,
} from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { useSelector } from "react-redux";
import { database } from "../../../config/firebaseConfig";
import useTabbar from "../../../hooks/useTabbar";
import "./PostDetail.scss";
import usePostDetail from "../../../hooks/community/usePostDetail";

interface PostDetailProps extends RouteComponentProps<MatchParams> {}
interface RootState {
  user: any;
  posts: any;
}
interface MatchParams {
  post_id: string;
}

const PostContainer: React.FC<PostDetailProps> = ({ match }) => {
  const currentUser = useSelector((state: RootState) => state.user);

  const postId = match.params.post_id;
  const post = usePostDetail(postId);
  useTabbar();

  const [commentInput, setCommentInput] = useState<string>("");

  const onSendComment = () => {
    setCommentInput("");
    handleSendComment(commentInput);
  };

  const handleSendComment = async (commentInput: string) => {
    if (commentInput.trim() === "") return;
    let comment = {
      author: currentUser.user.name,
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
    <IonPage>
      {post.postData && (
        <>
          <IonHeader>
            <IonToolbar className="toolbar">
              <IonButtons slot="start">
                <IonBackButton color="light" text="" defaultHref="/community" />
              </IonButtons>
              <IonTitle>{post.postData.title}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonCard className="post-wrapper">
              <IonCardContent>
                <IonRow className="post-info">
                  <div>
                    <img
                      alt="avatar"
                      style={{
                        borderRadius: "50%",
                        width: "95%",
                        maxWidth: 50,
                      }}
                      src={post.profileURL}
                    />
                  </div>
                  <div style={{ paddingLeft: 10, color: "initial" }}>
                    <p>{post.postData.author}</p>
                    <p>
                      {moment(post.postData.created_at).locale("vi").fromNow()}
                    </p>
                  </div>
                </IonRow>

                <IonRow style={{ paddingTop: 10, color: "initial" }}>
                  <p className="post-text">{post.postData.content}</p>
                </IonRow>
                <IonRow style={{ padding: "10px 0", color: "initial" }}>
                  {post.postData.sharedLink && (
                    <IonButton href={post.postData.sharedLink} fill="outline">
                      Tham gia
                    </IonButton>
                  )}
                </IonRow>

                <IonRow
                  style={{ borderTop: "1px solid #bbb", margin: "0 15px" }}
                >
                  <IonCol size="6">
                    <IonButton
                      size="default"
                      style={{ width: "100%", fontSize: 12 }}
                      color="dark"
                      fill="clear"
                      onClick={
                        post.isFavorited ? handleUnlikePost : handleLikePost
                      }
                    >
                      {post.isFavorited ? (
                        <IonIcon
                          color="primary"
                          slot="icon-only"
                          icon={heartSharp}
                        />
                      ) : (
                        <IonIcon slot="icon-only" icon={heartOutline} />
                      )}
                      <IonLabel style={{ paddingLeft: 7, overflow: "unset" }}>
                        ({post.likes}) Yêu thích
                      </IonLabel>
                    </IonButton>
                  </IonCol>

                  <IonCol size="6">
                    <IonButton
                      size="default"
                      style={{ width: "100%", fontSize: 12 }}
                      color="dark"
                      fill="clear"
                    >
                      <IonIcon slot="icon-only" icon={chatboxOutline} />
                      <IonLabel style={{ paddingLeft: 7, overflow: "unset" }}>
                        ({post.comments}) Bình luận
                      </IonLabel>
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>

            <IonList>
              {post.commentList.map((comment: any, index: number) => {
                return (
                  <div className="post-comment-wrapper" key={index}>
                    <b>{`${comment.data.author} | 
                              ${moment(comment.data.created_at)
                                .locale("vi")
                                .fromNow()}`}</b>
                    <p>{comment.data.content}</p>
                  </div>
                );
              })}
            </IonList>
          </IonContent>

          <IonItem lines="none" className="post-comment-input">
            <IonInput
              value={commentInput}
              placeholder="Nhập bình luận"
              onIonChange={(e) => setCommentInput(e.detail.value!)}
            ></IonInput>
            <IonButton
              size="default"
              color="dark"
              fill="clear"
              onClick={onSendComment}
            >
              <IonIcon
                className="send-icon"
                color="primary"
                ios={sendOutline}
                md={sendSharp}
              />
            </IonButton>
          </IonItem>
        </>
      )}
    </IonPage>
  );
};

export default PostContainer;
