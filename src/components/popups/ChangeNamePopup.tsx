import {
  IonButton,
  IonInput,
  IonItem,
  IonPopover,
  IonTitle,
} from "@ionic/react";
import React, { useState } from "react";
// import "./ForgotPasswordPopup.scss";

interface ChangeNamePopupProps {
  isOpen: boolean;
  username: string;
  handleCloseModal: () => void;
  handleChangeName: (name: string) => void;
}

const ChangeNamePopup: React.FC<ChangeNamePopupProps> = ({
  isOpen,
  username,
  handleCloseModal,
  handleChangeName,
}) => {
  const [name, setName] = useState<string>(username);

  return (
    <IonPopover
      cssClass="forgot-password-modal"
      isOpen={isOpen}
      onDidDismiss={handleCloseModal}
    >
      <IonTitle>Thay đổi tên hiển thị</IonTitle>
      <IonItem>
        <IonInput
          value={name}
          onIonChange={(e) => setName(e.detail.value!)}
        ></IonInput>
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
          onClick={() => handleChangeName(name)}
        >
          Gửi
        </IonButton>
      </IonItem>
    </IonPopover>
  );
};

export default ChangeNamePopup;
