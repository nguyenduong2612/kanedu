import { IonButton, IonIcon, IonItem, IonLabel, IonModal } from "@ionic/react";
import {
  book,
  bookOutline,
  closeOutline,
  closeSharp,
  library,
  libraryOutline,
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
          <IonIcon
            slot="start"
            color="primary"
            ios={libraryOutline}
            md={library}
          />
          <IonLabel>Tạo khóa học</IonLabel>
        </IonItem>
        <IonItem
          className="create-modal-item"
          lines="none"
          detail={false}
          routerLink="/lesson/create"
          onClick={() => handleCloseModal()}
        >
          <IonIcon
            slot="start"
            color="primary"
            ios={bookOutline}
            md={book}
          />
          <IonLabel>Tạo bài học</IonLabel>
        </IonItem>
      </div>
    </IonModal>
  );
};

export default CreateModal;
