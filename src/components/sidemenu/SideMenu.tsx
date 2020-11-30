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

import React from "react";
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
  peopleOutline,
  peopleSharp,
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
    title: "Trang chủ",
    url: "/home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "Tài khoản",
    url: "/profile",
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
  {
    title: "Cộng đồng",
    url: "/community",
    iosIcon: peopleOutline,
    mdIcon: peopleSharp,
  },
  {
    title: "Cài đặt",
    url: "/settings",
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
  },
];

const SideMenu: React.FC<ContainerProps> = (props) => {
  const location = useLocation();
  const user: any = props;

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Xin chào</IonListHeader>
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
              <IonLabel color="danger">Đăng xuất</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
