import {
  IonButton,
  IonInput,
  IonItem,
  IonPopover,
} from "@ionic/react";
import React, { useState } from "react";
import "./ForgotPasswordPopup.scss";

interface ForgotPasswordPopupProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  handleSendEmail: (email: string) => void;
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({
  isOpen,
  handleCloseModal,
  handleSendEmail,
}) => {
  const [email, setEmail] = useState<string>("");

  return (
    <IonPopover
      cssClass="forgot-password-modal"
      isOpen={isOpen}
      onDidDismiss={handleCloseModal}
    >
      <IonItem >
        <IonInput
          value={email}
          placeholder="Nhập email của bạn"
          onIonChange={(e) => setEmail(e.detail.value!)}
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
          onClick={() => handleSendEmail(email)}
        >
          Gửi
        </IonButton>
      </IonItem>
    </IonPopover>
  );
};

export default ForgotPasswordPopup;
