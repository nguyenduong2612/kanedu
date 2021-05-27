import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
} from "@ionic/react";
import {
  closeOutline,
  closeSharp,
  sendOutline,
  sendSharp,
  trash,
} from "ionicons/icons";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Post } from "../../models";
import { deleteComment } from "../../redux/post/post.actions";
import "./CommentsModal.scss";

interface CommentsModalProps {
  isOpen: boolean;
  commentCount: number;
  comments: any;
  posts: Post[],
  postId: string,
  userId: string,
  handleCloseModal: () => void;
  handleSendComment: (commentInput: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  commentCount,
  comments,
  posts,
  postId,
  userId,
  handleCloseModal,
  handleSendComment,
}) => {
  const [commentInput, setCommentInput] = useState<string>("");
  const dispatch = useDispatch();

  const onSendComment = () => {
    setCommentInput("");
    handleSendComment(commentInput);
  };

  const handleDeleteComment = (
    comment: any,
    postId: string,
    commentIndex: number
  ) => {
    if (comment.author_id !== userId) return;
    dispatch(deleteComment(posts, postId, comment.id, commentIndex));
  };

  return (
    <IonModal
      swipeToClose={true}
      isOpen={isOpen}
      cssClass="comment-modal"
      onDidDismiss={handleCloseModal}
      mode="ios"
    >
      <div className="comment-list-wrapper">
        <IonItem lines="none" className="modal-title">
          ({commentCount ? commentCount : 0}) Bình luận
          <IonButton fill="clear" onClick={handleCloseModal} slot="end">
            <IonIcon
              color="dark"
              slot="icon-only"
              ios={closeOutline}
              md={closeSharp}
            />
          </IonButton>
        </IonItem>
        {comments.map((comment: any, index: number) => {
          return (
            <div className="comment-wrapper" key={index}>
              <b>{`${comment.author} | 
                          ${moment(comment.created_at)
                            .locale("vi")
                            .fromNow()}`}</b>
              <p>{comment.content}</p>
              {comment.author_id === userId && (
                <IonButtons className="post-comment-delete" slot="end">
                  <IonButton
                    onClick={() => handleDeleteComment(comment, postId, index)}
                  >
                    <IonIcon color="dark" slot="icon-only" icon={trash} />
                  </IonButton>
                </IonButtons>
              )}
            </div>
          );
        })}
      </div>
      <IonItem lines="none" className="comment-input-wrapper">
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
    </IonModal>
  );
};

export default CommentsModal;
