import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import React from "react";
import {
  homeOutline,
  home,
  searchOutline,
  search,
  peopleOutline,
  people,
  languageOutline,
  language,
} from "ionicons/icons";
import Routing from "../../route/Routing";
import "./BottomTabbar.scss";

interface ContainerProps {}

const BottomTabbar: React.FC<ContainerProps> = () => {
  return (
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
  );
};

export default BottomTabbar;
