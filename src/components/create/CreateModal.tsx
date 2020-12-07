import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
} from "@ionic/react";
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
      onDidDismiss={() => handleCloseModal()}
    >
      <IonContent>
        <IonList>
          <IonItem
            lines="none"
            detail={false}
            routerLink="/course/create"
            onClick={() => handleCloseModal()}
          >
            <IonIcon slot="start" ios={libraryOutline} md={librarySharp} />
            <IonLabel>Tạo khóa học</IonLabel>
          </IonItem>
          <IonItem
            lines="none"
            detail={false}
            routerLink="/lesson/create"
            onClick={() => handleCloseModal()}
          >
            <IonIcon slot="start" ios={bookOutline} md={bookSharp} />
            <IonLabel>Tạo bài học</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default CreateModal;
