import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonBackButton,
  IonButtons,
  IonList,
  IonLabel,
  IonButton,
} from "@ionic/react";
import React from "react";
//import notifications from '../../utils/Notifications';

interface ContainerProps {}

const Settings: React.FC<ContainerProps> = () => {
  async function setLocalNoti() {
    // document.body.classList.toggle("dark", event.detail.checked);
    //await notifications.schedule("123123123")
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Cài đặt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel>Local Notifications</IonLabel>
            <IonButton onClick={setLocalNoti} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
