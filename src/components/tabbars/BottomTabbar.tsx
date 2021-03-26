import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  homeOutline,
  home,
  searchOutline,
  search,
  peopleOutline,
  people,
  languageOutline,
  language,
  add,
} from "ionicons/icons";
import Routing from "../../route/Routing";
import "./BottomTabbar.scss";
import { useSelector } from "react-redux";
import CreateModal from "../modals/CreateModal";
import { Capacitor, Plugins } from "@capacitor/core";

const { Keyboard } = Plugins;

interface BottomTabbarContainerProps {}

interface RootState {
  user: any;
}

const BottomTabbar: React.FC<BottomTabbarContainerProps> = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showFabButton, setShowFabButton] = useState<boolean>(true);
  const { isLoggedin } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (Capacitor.isPluginAvailable("Keyboard")) {
      Keyboard.addListener("keyboardWillShow", () => {
        setShowFabButton(false);
      });

      Keyboard.addListener("keyboardWillHide", () => {
        setShowFabButton(true);
      });
    }
  }, []);

  const handleShowModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return isLoggedin ? (
    <>
      <IonFab vertical="bottom" horizontal="center">
        {showFabButton && (
          <IonFabButton onClick={handleShowModal} id="appFabBtn">
            <IonIcon icon={add} size="large" />
          </IonFabButton>
        )}
        <CreateModal
          isOpen={showCreateModal}
          handleCloseModal={handleCloseModal}
        />
      </IonFab>
      <IonTabs>
        <IonRouterOutlet>
          <Routing />
        </IonRouterOutlet>

        <IonTabBar mode="md" slot="bottom" id="appTabBar">
          <IonTabButton tab="home" href="/home">
            <IonIcon ios={homeOutline} md={home} />
            <IonLabel>Trang chủ</IonLabel>
          </IonTabButton>
          <IonTabButton tab="search" href="/search">
            <IonIcon ios={searchOutline} md={search} />
            <IonLabel>Tìm kiếm</IonLabel>
          </IonTabButton>

          <IonTabButton disabled></IonTabButton>
          <IonTabButton tab="community" href="/community">
            <IonIcon ios={peopleOutline} md={people} />
            <IonLabel>Cộng đồng</IonLabel>
          </IonTabButton>

          <IonTabButton tab="dict" href="/dict">
            <IonIcon ios={languageOutline} md={language} />
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
