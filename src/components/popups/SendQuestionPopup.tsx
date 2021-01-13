import {
  IonButton,
  IonInput,
  IonItem,
  IonPopover,
  IonTextarea,
} from "@ionic/react";
import React, { useState } from "react";
import "./SendQuestionPopup.scss";

interface ContainerProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  handleSendQuestion: (title: string, content: string) => void;
}

const SendQuestionPopup: React.FC<ContainerProps> = ({
  isOpen,
  handleCloseModal,
  handleSendQuestion,
}) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  return (
    <IonPopover
      isOpen={isOpen}
      cssClass="send-question-modal"
      onDidDismiss={handleCloseModal}
    >
      <IonItem>
        <IonInput
          value={title}
          placeholder="Tiêu đề"
          onIonChange={(e: any) => setTitle(e.detail.value!)}
        ></IonInput>
      </IonItem>
      <IonItem lines="none">
        <IonTextarea
          rows={6}
          value={content}
          placeholder="Nội dung câu hỏi"
          onIonChange={(e: any) => setContent(e.detail.value!)}
        ></IonTextarea>
      </IonItem>
      <IonItem lines="none" className="modal-footer">
        <IonButton
          slot="end"
          size="default"
          color="primary"
          fill="clear"
          onClick={handleCloseModal}
        >
          Hủy
        </IonButton>
        <IonButton
          slot="end"
          size="default"
          color="primary"
          className="send-btn"
          onClick={() => handleSendQuestion(title, content)}
        >
          Đăng
        </IonButton>
      </IonItem>
    </IonPopover>
  );
};

export default SendQuestionPopup;
