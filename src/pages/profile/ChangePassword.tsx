import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonBackButton,
  IonButtons,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
  IonItemGroup,
} from "@ionic/react";
import { checkmarkOutline, checkmarkSharp } from "ionicons/icons";
import React, { useState } from "react";
import { toast } from "../../utils/toast";
import { reauthenticate, changePassword } from "../../helpers/firebaseHelper";
import { useSelector } from "react-redux";

interface RootState {
  user: any;
}

interface ChangePasswordPageProps {}

const ChangePassword: React.FC<ChangePasswordPageProps> = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { user } = useSelector((state: RootState) => state.user);

  const handleChangePassword = async () => {
    if (
      oldPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      return toast("Hãy nhập mật khẩu cũ và mật khẩu mới");
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      return toast("Mật khẩu xác nhận không trùng khớp");
    }

    if (await reauthenticate(user.email, oldPassword)) {
      await changePassword(newPassword);
      window.history.back();
    } else {
      return toast("Mật khẩu hiện tại không chính xác");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Thay đổi mật khẩu</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleChangePassword}>
              <IonIcon
                color="light"
                slot="icon-only"
                ios={checkmarkOutline}
                md={checkmarkSharp}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="bg-white">
        <IonItemGroup style={{ width: "95%", margin: "10px auto" }} className="max-width-700">
          <IonItem>
            <IonLabel position="floating">Mật khẩu hiện tại</IonLabel>
            <IonInput
              type="password"
              value={oldPassword}
              onIonChange={(e: any) => setOldPassword(e.target.value)}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Mật khẩu mới</IonLabel>
            <IonInput
              type="password"
              value={newPassword}
              onIonChange={(e: any) => setNewPassword(e.target.value)}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Xác nhận mật khẩu mới</IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              onIonChange={(e: any) => setConfirmPassword(e.target.value)}
            ></IonInput>
          </IonItem>
        </IonItemGroup>
      </IonContent>
    </IonPage>
  );
};

export default ChangePassword;
