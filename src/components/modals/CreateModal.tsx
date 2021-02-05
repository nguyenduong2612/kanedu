import { IonButton, IonIcon, IonItem, IonLabel, IonModal } from "@ionic/react";
import {
  bookOutline,
  closeOutline,
  closeSharp,
  libraryOutline,
} from "ionicons/icons";
import React from "react";
import "./CreateModal.scss";

interface CreateModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  handleCloseModal,
}) => {
  return (
    <IonModal
      swipeToClose={true}
      isOpen={isOpen}
      cssClass="create-modal"
      onDidDismiss={handleCloseModal}
      mode="ios"
    >
      <div className="create-modal-wrapper">
        <IonItem className="create-modal-item" lines="none">
          <b>Tạo</b>
          <IonButton fill="clear" onClick={handleCloseModal} slot="end">
            <IonIcon
              color="dark"
              slot="icon-only"
              ios={closeOutline}
              md={closeSharp}
            />
          </IonButton>
        </IonItem>

        <IonItem
          className="create-modal-item"
          lines="none"
          detail={false}
          routerLink="/course/create"
          onClick={() => handleCloseModal()}
        >
          <div className="create-modal-item__icon">
            <IonIcon slot="start" color="primary" icon={libraryOutline} />
          </div>
          <IonLabel className="create-modal-item__title">Tạo khóa học</IonLabel>
        </IonItem>
        <IonItem
          className="create-modal-item"
          lines="none"
          detail={false}
          routerLink="/lesson/create"
          onClick={() => handleCloseModal()}
        >
          <div className="create-modal-item__icon">
            <IonIcon slot="start" color="primary" icon={bookOutline} />
          </div>
          <IonLabel className="create-modal-item__title">Tạo bài học</IonLabel>
        </IonItem>
      </div>
    </IonModal>
  );
};

export default CreateModal;
