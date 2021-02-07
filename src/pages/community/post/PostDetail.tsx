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
import {
  chatboxOutline,
  heartOutline,
  heartSharp,
  sendOutline,
  sendSharp,
} from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import useTabbar from "../../../hooks/useTabbar";
import "./PostDetail.scss";
import {
  clearComments,
  getComments,
  likePost,
  saveComment,
  unlikePost,
} from "../../../redux/post/post.actions";

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
  const { posts, comments } = useSelector((state: RootState) => state.posts);
  const post = posts.find((post: any) => post.id === postId);
  const dispatch = useDispatch();

  useTabbar();
  useEffect(() => {
    dispatch(getComments(postId));

    return function clearCmts() {
      dispatch(clearComments);
    };
  }, [dispatch, postId]);

  const [commentInput, setCommentInput] = useState<string>("");

  const onSendComment = () => {
    setCommentInput("");
    handleSendComment(commentInput);
  };

  const handleSendComment = async (commentInput: string) => {
    if (commentInput.trim() === "") return;
    dispatch(saveComment(currentUser.user.name, commentInput, postId, posts));
  };

  const handleLikePost = () => {
    dispatch(likePost(posts, post.id, currentUser.user.uid));
  };

  const handleUnlikePost = () => {
    dispatch(unlikePost(posts, post.id, currentUser.user.uid));
  };

  return (
    <IonPage>
      {post && (
        <>
          <IonHeader>
            <IonToolbar className="toolbar">
              <IonButtons slot="start">
                <IonBackButton color="light" text="" defaultHref="/community" />
              </IonButtons>
              <IonTitle>{post.title}</IonTitle>
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
                      src={post.avatar}
                    />
                  </div>
                  <div style={{ paddingLeft: 10, color: "initial" }}>
                    <p>{post.author}</p>
                    <p>{moment(post.created_at).locale("vi").fromNow()}</p>
                  </div>
                </IonRow>

                <IonRow style={{ paddingTop: 10, color: "initial" }}>
                  <p className="post-text">{post.content}</p>
                </IonRow>
                <IonRow style={{ padding: "10px 0", color: "initial" }}>
                  {post.sharedLink && (
                    <IonButton href={post.sharedLink} fill="outline">
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
              {comments.map((comment: any, index: number) => {
                return (
                  <div className="post-comment-wrapper" key={index}>
                    <b>{`${comment.author} | 
                              ${moment(comment.created_at)
                                .locale("vi")
                                .fromNow()}`}</b>
                    <p>{comment.content}</p>
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
