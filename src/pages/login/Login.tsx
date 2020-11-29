import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg,
  IonText,
  IonLoading,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import "./Login.css";
import { Plugins } from "@capacitor/core";
import { Link } from "react-router-dom";
import { loginUser, loginWithFacebook } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";
import firebase from "firebase";

const Login: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // useEffect(() => {
  //   console.log(email, password)
  // })

  async function login() {
    if (email.trim() === "" || password.trim() === "") {
      return toast("Hãy nhập email và mật khẩu");
    }

    setBusy(true);
    const res = await loginUser(email, password);

    if (res) {
      toast("Đăng nhập thành công");
    } else {
      toast("Mật khẩu không chính xác");
      setPassword("");
    }

    setBusy(false);
  }

  async function loginFacebook() {
    await loginWithFacebook();
    window.history.replaceState({}, "", "/");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Đăng nhập</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait" duration={0} isOpen={busy} />
      <IonContent fullscreen>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e: any) => setEmail(e.target.value)}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Mật khẩu</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e: any) => setPassword(e.target.value)}
          ></IonInput>
        </IonItem>

        <IonButton className="ion-margin" expand="block" onClick={login}>
          ĐĂNG NHẬP
        </IonButton>

        <IonButton
          className="ion-margin"
          expand="block"
          onClick={loginFacebook}
        >
          ĐĂNG NHẬP VỚI FACEBOOK
        </IonButton>

        <IonItem lines="none">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Login;
