import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import React, {  } from "react";
import {
  home,
  search,
  people,
  language,
} from "ionicons/icons";
import Routing from "../../route/Routing";
import "./BottomTabbar.scss";
import { useSelector } from "react-redux";
// import { Plugins } from "@capacitor/core";

interface BottomTabbarContainerProps {}

interface RootState {
  user: any;
}

const BottomTabbar: React.FC<BottomTabbarContainerProps> = () => {
  const { isLoggedin } = useSelector((state: RootState) => state.user);

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
      </IonTabs>
    </>
  ) : (
    <IonRouterOutlet>
      <Routing />
    </IonRouterOutlet>
  );
};

export default BottomTabbar;
