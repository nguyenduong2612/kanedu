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
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  home,
  barbell,
  people,
  person,
  settings,
  logOut,
  language,
  medal,
  text,
  search,
  logIn,
  personAdd,
} from "ionicons/icons";
import "./SideMenu.scss";
import { signOutUser } from "../../redux/user/user.actions";

interface SidemenuContainerProps {}

interface RootState {
  user: any;
}
interface AppPage {
  url: string;
  icon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Trang chủ",
    url: "/home",
    icon: home,
  },
  {
    title: "Tìm kiếm",
    url: "/search",
    icon: search,
  },
  {
    title: "Hồ sơ",
    url: "/my-profile",
    icon: person,
  },
  {
    title: "Thi thử",
    url: "/jlpt",
    icon: barbell,
  },
  {
    title: "Từ điển",
    url: "/dict",
    icon: language,
  },
  {
    title: "Dịch",
    url: "/translate",
    icon: text,
  },
  {
    title: "Cộng đồng",
    url: "/community",
    icon: people,
  },
  {
    title: "Bảng xếp hạng",
    url: "/ranking",
    icon: medal,
  },
  {
    title: "Cài đặt",
    url: "/settings",
    icon: settings,
  },
];

const guestPages: AppPage[] = [
  {
    title: "Trang chủ",
    url: "/home",
    icon: home,
  },
  {
    title: "Tìm kiếm",
    url: "/search",
    icon: search,
  },
  {
    title: "Từ điển",
    url: "/dict",
    icon: language,
  },
  {
    title: "Dịch",
    url: "/translate",
    icon: text,
  },
];

const SideMenu: React.FC<SidemenuContainerProps> = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const signout = () => {
    dispatch(signOutUser());
    dispatch({type: "RESET_DATA"});
  };

  return (
    <IonMenu contentId="main" type="push">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Xin chào, {user ? user.name : "Khách"}</IonListHeader>
          <IonNote>{user ? user.email : "Đăng nhập để sử dụng nhiều tính năng hơn"}</IonNote>
          {(user ? appPages : guestPages).map((appPage, index) => {
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
                    icon={appPage.icon}
                  />
                  <IonLabel className="sidemenu__label" color="light">
                    {appPage.title}
                  </IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <IonMenuToggle autoHide={false}>
            <IonItem />
            {user ? (
              <IonItem
                button
                onClick={signout}
                routerDirection="none"
                lines="none"
                detail={false}
                routerLink="/welcome"
              >
                <IonIcon
                  color="light"
                  slot="start"
                  icon={logOut}
                />
                <IonLabel className="sidemenu__label" color="light">
                  Đăng xuất
                </IonLabel>
              </IonItem>
            ) : (
              <>
                <IonItem button lines="none" detail={false} routerLink="/login">
                  <IonIcon
                    color="light"
                    slot="start"
                    icon={logIn}
                  />
                  <IonLabel className="sidemenu__label" color="light">
                    Đăng nhập
                  </IonLabel>
                </IonItem>
                <IonItem
                  button
                  lines="none"
                  detail={false}
                  routerLink="/register"
                >
                  <IonIcon
                    color="light"
                    slot="start"
                    icon={personAdd}
                  />
                  <IonLabel className="sidemenu__label" color="light">
                    Đăng ký
                  </IonLabel>
                </IonItem>
              </>
            )}
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
