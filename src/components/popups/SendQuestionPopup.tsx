import {
  IonButton,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonItemDivider,
  IonPopover,
  IonRow,
  IonTextarea,
  IonThumbnail,
  IonTitle,
} from "@ionic/react";
import { closeCircle, images } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { storage } from "../../config/firebaseConfig";
import "./SendQuestionPopup.scss";

interface SendQuestionPopupProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  handleSendQuestion: (title: string, content: string, image_url?: any) => void;
}

const SendQuestionPopup: React.FC<SendQuestionPopupProps> = ({
  isOpen,
  handleCloseModal,
  handleSendQuestion,
}) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<any>(null);

  const imageInput = useRef<HTMLInputElement>(null);

  const getImageUrl = async (image: any) => {
    if (!image) return;
    const storageRef = storage.ref();

    const fileName = `${Date.now()}`;
    const fileRef = storageRef.child("post_images/" + fileName);

    try {
      await fileRef.put(image);
      return await fileRef.getDownloadURL();
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const handleClickSend = async () => {
    if (image) {
      let image_url = await getImageUrl(image);
      handleSendQuestion(title, content, image_url);
    } else {
      handleSendQuestion(title, content);
    }
  }

  return (
    <IonPopover
      isOpen={isOpen}
      cssClass="send-question-modal"
      onDidDismiss={handleCloseModal}
    >
      <IonTitle>Đặt câu hỏi</IonTitle>

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

      {image && (
        <IonGrid>
          <IonItemDivider />
          <IonRow>
            <p style={{ width: "100%", margin: 10 }}>Ảnh</p>
            <IonThumbnail className="img-preview">
              <IonButton
                fill="clear"
                onClick={() => setImage(null)}
                className="remove-img-btn"
              >
                <IonIcon color="dark" slot="icon-only" icon={closeCircle} />
              </IonButton>
              <IonImg src={URL.createObjectURL(image)} />
            </IonThumbnail>
          </IonRow>
        </IonGrid>
      )}

      <IonItem lines="none" className="modal-footer">
        <IonButton
          slot="start"
          fill="clear"
          size="default"
          color="medium"
          className="upload-img-btn"
          onClick={() => {
            imageInput.current?.click();
          }}
        >
          <IonIcon slot="icon-only" icon={images}></IonIcon>
        </IonButton>
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
          onClick={handleClickSend}
        >
          Đăng
        </IonButton>

        <input
          className="ion-hide"
          onChange={(e: any) => {
            setImage(e.target.files[0]);
          }}
          ref={imageInput}
          type="file"
        ></input>
      </IonItem>
    </IonPopover>
  );
};

export default SendQuestionPopup;
