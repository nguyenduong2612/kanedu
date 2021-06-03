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
  IonAlert,
  IonActionSheet,
  useIonRouter,
  IonThumbnail,
} from "@ionic/react";
import {
  chatboxOutline,
  ellipsisHorizontal,
  ellipsisVertical,
  heartOutline,
  heartSharp,
  sendOutline,
  sendSharp,
  trash,
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
  deleteComment,
  deletePost,
  getComments,
  likePost,
  saveComment,
  unlikePost,
} from "../../../redux/post/post.actions";
import { Post } from "../../../models";
import { toast } from "../../../utils/toast";

interface PostDetailProps extends RouteComponentProps<MatchParams> {}
interface RootState {
  user: any;
  posts: any;
}
interface MatchParams {
  post_id: string;
}

const PostContainer: React.FC<PostDetailProps> = ({ match }) => {
  const router = useIonRouter();

  const postId = match.params.post_id;
  const { user } = useSelector((state: RootState) => state.user);
  const { posts, comments } = useSelector((state: RootState) => state.posts);

  const [showDeletePostPopover, setShowDeletePostPopover] =
    useState<boolean>(false);
  const [showDeleteCommentPopover, setShowDeleteCommentPopover] =
    useState<boolean>(false);
  const [showDeletePostAlert, setShowDeletePostAlert] =
    useState<boolean>(false);

  const post = posts.find((post: Post) => post.id === postId);
  const dispatch = useDispatch();

  useTabbar();
  useEffect(() => {
    dispatch(getComments(postId));

    return function clearCmts() {
      dispatch(clearComments);
    };
  }, [dispatch, postId, post.author_id, user.uid]);

  const [commentInput, setCommentInput] = useState<string>("");

  const onSendComment = () => {
    setCommentInput("");
    handleSendComment(commentInput);
  };

  const handleSendComment = async (commentInput: string) => {
    if (commentInput.trim() === "") return;
    let comment = {
      author: user.name,
      author_id: user.uid,
      content: commentInput,
      created_at: Date.now(),
    };
    dispatch(saveComment(comment, postId, posts));
  };

  const handleLikePost = () => {
    dispatch(likePost(posts, post.id, user.uid));
  };

  const handleUnlikePost = () => {
    dispatch(unlikePost(posts, post.id, user.uid));
  };

  const handleDeletePost = () => {
    setShowDeletePostAlert(true);
  };

  const handleConfirmDeletePost = () => {
    if (post.author_id !== user.uid) return;
    dispatch(deletePost(posts, post.id, user.uid));
    toast("Đã xóa bài đăng");
    window.history.back();
  };

  const handleConfirmDeleteComment = (
    comment: any,
    postId: string,
    commentIndex: number
  ) => {
    if (comment.author_id !== user.uid) return;
    dispatch(deleteComment(posts, postId, comment.id, commentIndex));
    toast("Đã xóa bình luận");
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
              {post.author_id === user.uid && (
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowDeletePostPopover(true)}>
                    <IonIcon
                      color="light"
                      slot="icon-only"
                      icon={ellipsisVertical}
                    />
                  </IonButton>

                  <IonActionSheet
                    isOpen={showDeletePostPopover}
                    cssClass="course-detail-modal"
                    onDidDismiss={() => setShowDeletePostPopover(false)}
                    buttons={[
                      {
                        text: "Xóa bài đăng",
                        icon: trash,
                        handler: handleDeletePost,
                      },
                    ]}
                  ></IonActionSheet>
                </IonButtons>
              )}
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <div className="max-width-700">
              <IonCard className="post-wrapper" mode="ios">
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
                        onClick={() => router.push(`/users/${post.author_id}`)}
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

                  {post.image_url && (
                    <IonRow>
                      <IonThumbnail className="post-detail-thumbnail">
                        <img alt="post-img" className="post-img" src={post.image_url} />
                      </IonThumbnail>
                    </IonRow>
                  )}

                  <IonRow style={{ padding: "10px 0", color: "initial" }}>
                    {post.sharedLink && (
                      <IonButton
                        href={post.sharedLink}
                        fill="outline"
                        mode="md"
                      >
                        Tham gia ngay
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

              <IonList style={{ backgroundColor: "#fff" }}>
                <IonTitle className="post-comment-title">Bình luận</IonTitle>
                {comments.map((comment: any, index: number) => {
                  return (
                    <div className="post-comment-wrapper" key={index}>
                      <b>{`${comment.author} | 
                              ${moment(comment.created_at)
                                .locale("vi")
                                .fromNow()}`}</b>
                      <p>{comment.content}</p>
                      {comment.author_id === user.uid && (
                        <IonButtons className="post-comment-delete" slot="end">
                          <IonButton
                            onClick={() => setShowDeleteCommentPopover(true)}
                          >
                            <IonIcon
                              color="dark"
                              slot="icon-only"
                              icon={ellipsisHorizontal}
                            />
                          </IonButton>

                          <IonActionSheet
                            isOpen={showDeleteCommentPopover}
                            cssClass="course-detail-modal"
                            onDidDismiss={() =>
                              setShowDeleteCommentPopover(false)
                            }
                            buttons={[
                              {
                                text: "Xóa bình luận",
                                icon: trash,
                                handler: () =>
                                  handleConfirmDeleteComment(
                                    comment,
                                    postId,
                                    index
                                  ),
                              },
                            ]}
                          ></IonActionSheet>
                        </IonButtons>
                      )}
                    </div>
                  );
                })}
              </IonList>
            </div>
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

          <IonAlert
            isOpen={showDeletePostAlert}
            cssClass="alert"
            onDidDismiss={() => setShowDeletePostAlert(false)}
            header={"Chú ý"}
            message={`Xác nhận xóa bài đăng này ?`}
            buttons={[
              {
                text: "Hủy",
              },
              {
                text: "Xác nhận",
                role: "confirm",
                cssClass: "text--red",
                handler: handleConfirmDeletePost,
              },
            ]}
          />
        </>
      )}
    </IonPage>
  );
};

export default PostContainer;
