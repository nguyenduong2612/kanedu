import { IonIcon, IonItem, IonLabel, IonModal } from "@ionic/react";
import {
  bookOutline,
  bookSharp,
  libraryOutline,
  librarySharp,
} from "ionicons/icons";
import React from "react";
import "./CreateModal.scss";

interface ContainerProps {
  isOpen: boolean;
  handleCloseModal: () => void;
}

const CreateModal: React.FC<ContainerProps> = ({
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
          Tạo
        </IonItem>
        <IonItem
          className="create-modal-item"
          lines="none"
          detail={false}
          routerLink="/course/create"
          onClick={() => handleCloseModal()}
        >
          <IonIcon slot="start" ios={libraryOutline} md={librarySharp} />
          <IonLabel>Tạo khóa học</IonLabel>
        </IonItem>
        <IonItem
          className="create-modal-item"
          lines="none"
          detail={false}
          routerLink="/lesson/create"
          onClick={() => handleCloseModal()}
        >
          <IonIcon slot="start" ios={bookOutline} md={bookSharp} />
          <IonLabel>Tạo bài học</IonLabel>
        </IonItem>
      </div>
    </IonModal>
  );
};

export default CreateModal;
