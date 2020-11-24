import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  logOutOutline,
  logOutSharp,
  homeOutline,
  homeSharp,
  personOutline,
  personSharp,
  settingsOutline,
  settingsSharp,
} from "ionicons/icons";
import "./SideMenu.css";
import { signoutUser } from "../../config/firebaseConfig";

interface ContainerProps {}
interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Dashboard",
    url: "/home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "Profile",
    url: "/profile",
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
  {
    title: "Settings",
    url: "/settings",
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
  },
];

const SideMenu: React.FC<ContainerProps> = (props) => {
  const location = useLocation();
  const [user, setUser] = useState<any>(props);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Hello</IonListHeader>
          <IonNote>{user.email}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <IonMenuToggle autoHide={false}>
            <IonItem />
            <IonItem
              onClick={signoutUser}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonIcon
                color="danger"
                slot="start"
                ios={logOutOutline}
                md={logOutSharp}
              />
              <IonLabel color="danger">Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
