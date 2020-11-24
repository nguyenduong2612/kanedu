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
  IonToggle,
} from "@ionic/react";
import React, { useState, useEffect } from "react";

interface ContainerProps {}

const Settings: React.FC<ContainerProps> = () => {
  function setDarkMode(event: any) {
    document.body.classList.toggle("dark", event.detail.checked);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle onIonChange={(e: any) => setDarkMode(e)} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
