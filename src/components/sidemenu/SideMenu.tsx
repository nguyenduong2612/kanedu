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
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  logOutOutline,
  homeOutline,
  personOutline,
  settingsOutline,
  peopleOutline,
  home,
  barbell,
  barbellOutline,
  people,
  person,
  settings,
  logOut,
  language,
  languageOutline,
} from "ionicons/icons";
import "./SideMenu.scss";
import { signoutUser } from "../../config/firebaseConfig";

interface ContainerProps {}

interface RootState {
  user: any;
}
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
    mdIcon: home,
  },
  {
    title: "Tài khoản",
    url: "/profile",
    iosIcon: personOutline,
    mdIcon: person,
  },
  {
    title: "Thi thử",
    url: "/jlpt",
    iosIcon: barbellOutline,
    mdIcon: barbell,
  },
  {
    title: "Từ điển",
    url: "/dict",
    iosIcon: languageOutline,
    mdIcon: language,
  },
  {
    title: "Cộng đồng",
    url: "/community",
    iosIcon: peopleOutline,
    mdIcon: people,
  },
  {
    title: "Cài đặt",
    url: "/settings",
    iosIcon: settingsOutline,
    mdIcon: settings,
  },
];

const SideMenu: React.FC<ContainerProps> = () => {
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.user);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Xin chào, {currentUser.user.name}</IonListHeader>
          <IonNote>{currentUser.user.email}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  button
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
                  <IonLabel color="light">{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <IonMenuToggle autoHide={false}>
            <IonItem />
            <IonItem
              button
              onClick={signoutUser}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonIcon
                color="light"
                slot="start"
                ios={logOutOutline}
                md={logOut}
              />
              <IonLabel color="light">Đăng xuất</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
