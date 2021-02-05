import {
  IonContent,
  IonItem,
  IonInput,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLabel,
  IonLoading,
  IonDatetime,
  IonBackButton,
  IonButtons,
  IonList,
  IonCard,
  IonCol,
  IonRow,
  IonIcon,
} from "@ionic/react";
import { logoFacebook, logoGoogle } from "ionicons/icons";
import React, { useState } from "react";
import { signupUser } from "../../helpers/firebaseHelper";
import { toast } from "../../utils/toast";
import "./Register.scss";

const Register: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>(
    new Date().toISOString().substr(0, 10)
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  async function signup() {
    if (email.trim() === "" || password.trim() === "") {
      return toast("Hãy nhập email và mật khẩu");
    }

    if (password === confirmPassword) {
      setBusy(true);
      const profileURL: string =
        "https://manskkp.lv/assets/images/users/default-user.png";
      const res = await signupUser(name, birthday, email, password, profileURL);

      if (res) {
        toast("Đăng ký thành công");
      } else {
        console.log("Register failed");
      }
      setBusy(false);
    } else {
      toast("Mật khẩu xác nhận không khớp");
    }
  }

  return (
    <IonPage className="landing-page page-container">
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Đăng ký</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Vui lòng đợi" duration={0} isOpen={busy} />
      <IonContent fullscreen>
        <IonList className="signup-wrapper">
          <IonLabel className="signup-wrapper__text" color="medium">Đăng nhập sử dụng tài khoản đã có</IonLabel>
          <IonRow>
            <IonCol size="6">
              <IonCard className="social-login-btn" button={true} mode="md">
                <IonIcon
                  className="social-login-icon"
                  icon={logoGoogle}
                ></IonIcon>
                <IonTitle>Google</IonTitle>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="social-login-btn" button={true} mode="md">
                <IonIcon
                  className="social-login-icon"
                  icon={logoFacebook}
                ></IonIcon>
                <IonTitle>Facebook</IonTitle>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonLabel className="signup-wrapper__text" color="medium">Hoặc đăng ký tài khoản mới</IonLabel>
          <IonItem>
            <IonLabel position="floating">Họ tên</IonLabel>
            <IonInput
              required
              type="text"
              value={name}
              onIonChange={(e: any) => setName(e.target.value)}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Ngày sinh</IonLabel>
            <IonDatetime
              displayFormat="MMM D, YYYY"
              min="1930"
              max="2020"
              placeholder="Select Date"
              value={birthday.substr(0, 10)}
              onIonChange={(e: any) => setBirthday(e.target.value)}
            ></IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              required
              type="email"
              value={email}
              onIonChange={(e: any) => setEmail(e.target.value)}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Mật khẩu</IonLabel>
            <IonInput
              required
              type="password"
              value={password}
              onIonChange={(e: any) => setPassword(e.target.value)}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Xác nhận mật khẩu</IonLabel>
            <IonInput
              required
              type="password"
              value={confirmPassword}
              onIonChange={(e: any) => setConfirmPassword(e.target.value)}
            ></IonInput>
          </IonItem>
          <IonButton
            style={{ marginTop: 35 }}
            size="default"
            expand="block"
            mode="ios"
            onClick={signup}
          >
            ĐĂNG KÝ
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Register;
