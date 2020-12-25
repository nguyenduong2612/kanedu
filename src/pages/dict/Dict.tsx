import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonList,
  IonMenuButton,
} from "@ionic/react";
import React from "react";

interface ContainerProps {}

const Dict: React.FC<ContainerProps> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonMenuButton
              slot="start"
              className="menu-btn"
              color="light"
            ></IonMenuButton>
          </IonButtons>
          <IonTitle>Từ điển</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList></IonList>
      </IonContent>
    </IonPage>
  );
};

export default Dict;
