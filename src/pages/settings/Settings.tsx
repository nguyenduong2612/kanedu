import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonLabel,
  IonItemGroup,
  IonMenuButton,
} from "@ionic/react";
import React from "react";
//import notifications from '../../utils/Notifications';

interface SettingPageProps {}

const Settings: React.FC<SettingPageProps> = () => {
  // async function setLocalNoti() {
  //   document.body.classList.toggle("dark", event.detail.checked);
  //   await notifications.schedule("123123123")
  // }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="light"
          ></IonMenuButton>
          <IonTitle>Cài đặt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="max-width-700">
          <IonItemGroup className="subsection-wrapper">
            {/* <IonItem>
            <IonLabel>Local Notifications</IonLabel>
            <IonButton onClick={setLocalNoti} />
          </IonItem> */}

            <IonItem lines="none" routerLink="/settings/goal">
              <IonLabel>Thiết lập mục tiêu</IonLabel>
            </IonItem>

            <IonItem lines="none" routerLink="/settings/reminder">
              <IonLabel>Thông báo nhắc nhở</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
