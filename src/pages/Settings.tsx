import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButton, IonMenuButton, IonIcon, IonBackButton, IonButtons, IonSplitPane, IonList, IonLabel, IonToggle } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import SideMenu from '../components/sidemenu/SideMenu';

interface ContainerProps { }

const Settings: React.FC<ContainerProps> = () => {

  function setDarkMode(event: any) {
    document.body.classList.toggle('dark', event.detail.checked);
  }

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton color='dark' defaultHref="/" />
            </IonButtons>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            <IonItem>
              <IonLabel >Dark Mode</IonLabel>
              <IonToggle onIonChange={(e: any) => setDarkMode(e)} />
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
  );
};

export default Settings
