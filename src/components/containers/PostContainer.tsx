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
import { chatboxOutline, heartOutline, heartSharp } from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearComments,
  getComments,
  likePost,
  saveComment,
  unlikePost,
} from "../../redux/post/post.actions";
import CommentsModal from "../modals/CommentsModal";
import "./PostContainer.scss";

interface PostContainerProps {
  key: number;
  post: any;
  username: string;
}

interface RootState {
  user: any;
  posts: any;
}

const PostContainer: React.FC<PostContainerProps> = ({ post, username }) => {
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

  const currentUser = useSelector((state: RootState) => state.user);
  const { posts, comments } = useSelector((state: RootState) => state.posts);
  const postId = post.id;
  const dispatch = useDispatch();

  const handleSendComment = async (commentInput: string) => {
    if (commentInput.trim() === "") return;
    dispatch(saveComment(username, commentInput, postId, posts));
  };

  const handleShowModal = () => {
    setShowCommentModal(true);
    dispatch(getComments(postId));
  };

  const handleCloseModal = () => {
    setShowCommentModal(false);
    dispatch(clearComments());
  };

  const handleLikePost = () => {
    dispatch(likePost(posts, post.id, currentUser.user.uid));
  };

  const handleUnlikePost = () => {
    dispatch(unlikePost(posts, post.id, currentUser.user.uid));
  };

  return (
    <div>
      {post && (
        <IonCard className="post-wrapper">
          <IonCardHeader>
            <IonText style={{ fontSize: 16, color: "black" }}>
              {post.title}
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
                    src={post.avatar}
                  />
                </div>
                <div style={{ paddingLeft: 10 }}>
                  <p>{post.author}</p>
                  <p>{moment(post.created_at).locale("vi").fromNow()}</p>
                </div>
              </IonRow>

              <IonRow>
                <p className="post-text">{post.content}</p>
              </IonRow>
              <IonRow>
                {post.sharedLink && (
                  <IonButton href={post.sharedLink} fill="outline">
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
                comments={comments}
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
