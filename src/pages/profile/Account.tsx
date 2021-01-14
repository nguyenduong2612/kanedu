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
  IonIcon,
} from "@ionic/react";
import React from "react";
import { useSelector } from "react-redux";
import "./Account.scss";
import { database, storage, verifyEmail } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";
import { camera } from "ionicons/icons";

interface ContainerProps {}
interface RootState {
  user: any;
}

const Account: React.FC<ContainerProps> = () => {
  const currentUser = useSelector((state: RootState) => state.user);

  async function verifyUser() {
    const res = await verifyEmail();

    if (res) {
      toast("Đã gửi email xác nhận");
    } else {
      toast("Có lỗi xảy ra");
    }
  }

  const uploadAvatar = async (avatar: any) => {
    if (avatar) {
      const storageRef = storage.ref();

      const fileName = `${currentUser.user.uid}`;
      const fileRef = storageRef.child("users_avatar/" + fileName);

      //console.log(avatar);
      toast("Thay đổi ảnh đại diện thành công");
      try {
        await fileRef.put(avatar);
        await database
          .collection("users")
          .doc(currentUser.user.uid)
          .update({ profileURL: await fileRef.getDownloadURL() });

        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <IonPage id="main">
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="light"
          ></IonMenuButton>
          <IonTitle>Tài khoản</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          <IonItemGroup>
            <div className="avatar-wrapper">
              <img
                alt="avatar"
                className="profile-img"
                src={currentUser.user.profileURL}
                width="100"
                height="100"
              />
              <label htmlFor="avatarInput">
                <IonIcon icon={camera}></IonIcon>
              </label>
            </div>

            <input
              type="file"
              name="avatar"
              id="avatarInput"
              onChange={(e: any) => uploadAvatar(e.target.files[0])}
            />

            <IonItem lines="none">
              <b className="username">{currentUser.user.name}</b>
            </IonItem>
            <IonItemDivider mode="md" />
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
            <IonItem lines="none" routerLink="/change-password">
              <IonLabel>Thay đổi mật khẩu</IonLabel>
            </IonItem>
            <IonItemDivider mode="md" />
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
            <IonItemDivider mode="md" />
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Account;
