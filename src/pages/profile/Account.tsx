import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonLabel,
  IonItemGroup,
  IonText,
  IonIcon,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Account.scss";
import { database, storage } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";
import { camera, createOutline } from "ionicons/icons";
import Refresher from "../../components/utils/Refresher";
import { addAchievement } from "../../helpers/achievementHelper";
import { verifyEmail } from "../../helpers/firebaseHelper";
import ChangeNamePopup from "../../components/popups/ChangeNamePopup";
import { changeUsername } from "../../redux/user/user.actions";

interface AccountPageProps {}
interface RootState {
  user: any;
}

const Account: React.FC<AccountPageProps> = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

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

      const fileName = `${user.uid}`;
      const fileRef = storageRef.child("users_avatar/" + fileName);

      //console.log(avatar);
      try {
        toast("Thay đổi ảnh đại diện thành công");
        await fileRef.put(avatar);
        await database
          .collection("users")
          .doc(user.uid)
          .update({ profileURL: await fileRef.getDownloadURL() });

        if (!(await addAchievement(user, "RjNEtQwBqgVHWdihJO9h", "reload")))
          window.location.reload();

        //window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChangeName = (name: string) => {
    setIsModalOpen(false);
    dispatch(changeUsername(user.uid, name));
    toast("Thay đổi tên hiển thị thành công");
  };

  return (
    <IonPage id="main">
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Tài khoản</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="account-settings">
        <Refresher />
        <div className="max-width-700">
          <IonItemGroup className="subsection-wrapper">
            <div className="avatar-wrapper">
              <img
                alt="avatar"
                className="profile-img"
                src={user.profileURL}
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

            <div className="username-wrapper">
              <b className="username">{user.name}</b>
              <IonButton fill="clear" mode="md" onClick={() => setIsModalOpen(true)}>
                <IonIcon
                  slot="icon-only"
                  color="dark"
                  icon={createOutline}
                ></IonIcon>
              </IonButton>
            </div>
          </IonItemGroup>

          <IonItemGroup className="subsection-wrapper">
            <IonItem lines="none">
              <IonLabel>Email</IonLabel>
              <p style={{ color: "#aaa" }}>{user.email}</p>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Ngày sinh</IonLabel>
              <p style={{ color: "#aaa" }}>{user.birthday}</p>
            </IonItem>
            <IonItem lines="none" routerLink="/change-password">
              <IonLabel>Thay đổi mật khẩu</IonLabel>
            </IonItem>
          </IonItemGroup>

          <IonItemGroup className="subsection-wrapper">
            {user.verified ? (
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
          </IonItemGroup>
        </div>

        <ChangeNamePopup
          isOpen={isModalOpen}
          username={user.name}
          handleCloseModal={() => setIsModalOpen(false)}
          handleChangeName={handleChangeName}
        />
      </IonContent>
    </IonPage>
  );
};

export default Account;
