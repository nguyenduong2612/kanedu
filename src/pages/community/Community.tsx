import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonMenuButton,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "../../theme/app.css";

interface ContainerProps {}

const VerifyRequest: React.FC = () => {
  return (
    <div className="container">
      <strong>Vui lòng xác nhận email của bạn</strong>
    </div>
  );
};

const Community: React.FC<ContainerProps> = (props) => {
  const [user, setUser] = useState<any>(props);
  const [verified, setVerified] = useState<boolean>(user.emailVerified);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="dark"
          ></IonMenuButton>
          <IonTitle>Cộng đồng</IonTitle>
        </IonToolbar>
      </IonHeader>
      {verified ? <IonContent fullscreen></IonContent> : <VerifyRequest />}
    </IonPage>
  );
};

export default Community;
