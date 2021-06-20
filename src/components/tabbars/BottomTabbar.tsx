import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import React from "react";
import { home, search, people, language, idCard, reader } from "ionicons/icons";
import Routing from "../../route/Routing";
import "./BottomTabbar.scss";
import { useSelector } from "react-redux";
// import { Plugins } from "@capacitor/core";

interface BottomTabbarContainerProps {}

interface RootState {
  user: any;
}

const BottomTabbar: React.FC<BottomTabbarContainerProps> = () => {
  const { isLoggedin, user } = useSelector((state: RootState) => state.user);

  // useEffect(() => {
  //   if (Capacitor.isPluginAvailable("Keyboard")) {
  //     Keyboard.addListener("keyboardWillShow", () => {
  //       setShowFabButton(false);
  //     });

  //     Keyboard.addListener("keyboardWillHide", () => {
  //       setShowFabButton(true);
  //     });
  //   }
  // }, []);

  return isLoggedin ? (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Routing />
        </IonRouterOutlet>

        {user.is_admin ? (
          <IonTabBar mode="md" slot="bottom" id="appTabBar">
            <IonTabButton tab="user-manage" href="/admin/user-manage">
              <IonIcon icon={idCard} />
              <IonLabel>Quản lý người dùng</IonLabel>
            </IonTabButton>

            <IonTabButton tab="post-manage" href="/admin/post-manage">
              <IonIcon icon={reader} />
              <IonLabel>Quản lý bài đăng</IonLabel>
            </IonTabButton>
          </IonTabBar>
        ) : (
          <IonTabBar mode="md" slot="bottom" id="appTabBar">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Trang chủ</IonLabel>
            </IonTabButton>
            <IonTabButton tab="search" href="/search">
              <IonIcon icon={search} />
              <IonLabel>Tìm kiếm</IonLabel>
            </IonTabButton>

            <IonTabButton tab="community" href="/community">
              <IonIcon icon={people} />
              <IonLabel>Cộng đồng</IonLabel>
            </IonTabButton>

            <IonTabButton tab="dict" href="/dict">
              <IonIcon icon={language} />
              <IonLabel>Từ điển</IonLabel>
            </IonTabButton>
          </IonTabBar>
        )}
      </IonTabs>
    </>
  ) : (
    <IonRouterOutlet>
      <Routing />
    </IonRouterOutlet>
  );
};

export default BottomTabbar;
