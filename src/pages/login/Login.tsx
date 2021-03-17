import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLoading,
  IonBackButton,
  IonButtons,
  IonList,
  IonCol,
  IonRow,
  IonCard,
  IonIcon,
} from "@ionic/react";
import React, { useState } from "react";
import "./Login.scss";
import {
  forgotPassword,
  loginUser,
  loginWithFacebook,
} from "../../helpers/firebaseHelper";
import { toast } from "../../utils/toast";
import { logoFacebook, logoGoogle } from "ionicons/icons";
import ForgotPasswordPopup from "../../components/popups/ForgotPasswordPopup";

const Login: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const handleSendResetPasswordEmail = async (email: string) => {
    if (await forgotPassword(email)) {
      setIsModalOpen(false);
    }
  };

  return (
    <IonPage className="landing-page page-container">
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Đăng nhập</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Vui lòng đợi" duration={0} isOpen={busy} />
      <IonContent fullscreen>
        <IonList className="login-wrapper">
          <IonLabel className="login-wrapper__text" color="medium">
            Đăng nhập sử dụng tài khoản đã có
          </IonLabel>
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
              <IonCard
                className="social-login-btn"
                button={true}
                mode="md"
                onClick={loginFacebook}
              >
                <IonIcon
                  className="social-login-icon"
                  icon={logoFacebook}
                ></IonIcon>
                <IonTitle>Facebook</IonTitle>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonLabel className="login-wrapper__text" color="medium">
            Hoặc đăng nhập với email
          </IonLabel>
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

          <IonButton
            style={{ marginTop: 35 }}
            size="default"
            expand="block"
            mode="ios"
            onClick={login}
          >
            ĐĂNG NHẬP
          </IonButton>

          <IonButton
            style={{ marginTop: 15 }}
            size="small"
            fill="clear"
            expand="block"
            mode="ios"
            onClick={() => setIsModalOpen(true)}
          >
            Quên mật khẩu?
          </IonButton>

          <ForgotPasswordPopup
            isOpen={isModalOpen}
            handleCloseModal={() => setIsModalOpen(false)}
            handleSendEmail={handleSendResetPasswordEmail}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Login;
