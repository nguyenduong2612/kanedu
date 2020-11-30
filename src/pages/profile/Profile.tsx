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
import React, { useState, useEffect } from "react";
import "./Profile.css";
import { database, verifyEmail } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";

interface ContainerProps {}

const Profile: React.FC<ContainerProps> = (props) => {
  const [username, setUsername] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [profileURL, setProfileURL] = useState<string>("");
  
  const user: any = props;
  const verified: boolean = user.emailVerified;

  useEffect(() => {
    async function getInfo() {
      const ref = database
        .collection("users")
        .where("uid", "==", user.uid)
        .limit(1);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setUsername(doc.data().name);
          setBirthday(doc.data().birthday);
          setProfileURL(doc.data().profileURL);
        });
      }

    }

    getInfo();
  }, [user]);

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
                src={profileURL}
                width="100"
                height="100"
              />
            </IonItem>
            <IonItem lines="none">
              <b className="username">{username}</b>
            </IonItem>
            <IonItemDivider />
          </IonItemGroup>

          <IonItemGroup>
            <IonItem lines="none">
              <IonLabel>Email</IonLabel>
              <p style={{ color: "#aaa" }}>{user.email}</p>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Ngày sinh</IonLabel>
              <p style={{ color: "#aaa" }}>{birthday}</p>
            </IonItem>
            <IonItemDivider />
          </IonItemGroup>

          <IonItemGroup>
            {verified ? (
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
