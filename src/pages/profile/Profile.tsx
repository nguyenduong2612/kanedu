import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonList,
  IonLabel,
  IonItemDivider,
  IonItemGroup,
  IonText,
  IonMenuButton,
} from "@ionic/react";
import React from "react";
import { useSelector } from 'react-redux'
import "./Profile.css";
import { verifyEmail } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";

interface ContainerProps {}
interface RootState {
  user: any
}

const Profile: React.FC<ContainerProps> = () => {
  const currentUser = useSelector((state: RootState) => state.user);

  async function verifyUser() {
    const res = await verifyEmail();

    if (res) {
      toast("Email sent");
    } else {
      toast("An error happened");
    }

  }

  return (
    <IonPage id="main">
      <IonHeader>
        <IonToolbar>
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="dark"
          ></IonMenuButton>
          <IonTitle>Tài khoản</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          <IonItemGroup>
            <IonItem lines="none">
              <img
                alt="avatar"
                className="profile-img"
                src={currentUser.user.profileURL}
                width="100"
                height="100"
              />
            </IonItem>
            <IonItem lines="none">
              <b className="username">{currentUser.user.name}</b>
            </IonItem>
            <IonItemDivider />
          </IonItemGroup>

          <IonItemGroup>
            <IonItem lines="none">
              <IonLabel>Email</IonLabel>
              <p style={{ color: "#aaa" }}>{currentUser.user.email}</p>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Ngày sinh</IonLabel>
              <p style={{ color: "#aaa" }}>{currentUser.user.birthday}</p>
            </IonItem>
            <IonItemDivider />
          </IonItemGroup>

          <IonItemGroup>
            {currentUser.user.verified ? (
              <IonItem lines="none">
                <IonLabel>Xác thực email</IonLabel>
                <IonText color="success">Đã xác thực</IonText>
              </IonItem>
            ) : (
              <IonItem lines="none">
                <IonLabel>Xác thực email</IonLabel>
                <IonText color="danger">Chưa xác thực</IonText>
                <IonButton slot="end" color="primary" onClick={verifyUser}>
                  Xác thực
                </IonButton>
              </IonItem>
            )}
            <IonItemDivider />
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
