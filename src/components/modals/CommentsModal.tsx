import { IonButton, IonIcon, IonInput, IonItem, IonModal } from "@ionic/react";
import { closeOutline, closeSharp, sendOutline, sendSharp } from "ionicons/icons";
import moment from "moment";
import React, { useState } from "react";
import "./CommentsModal.scss";

interface CommentsModalProps {
  isOpen: boolean;
  commentCount: number;
  commentList: any;
  handleCloseModal: () => void;
  handleSendComment: (commentInput: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  commentCount,
  commentList,
  handleCloseModal,
  handleSendComment
}) => {
  const [commentInput, setCommentInput] = useState<string>("");

  const onSendComment = () => {
    setCommentInput("");
    handleSendComment(commentInput);
  }
  
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
        {commentList.map((comment: any, index: number) => {
          return (
            <div className="comment-wrapper" key={index}>
              <b>{`${comment.data.author} | 
                          ${moment(comment.data.created_at)
                            .locale("vi")
                            .fromNow()}`}</b>
              <p>{comment.data.content}</p>
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
