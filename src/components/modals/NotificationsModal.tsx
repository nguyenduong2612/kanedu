import {
  IonButton,
  IonIcon,
  IonItem,
  IonModal,
} from "@ionic/react";
import { closeOutline, closeSharp, notificationsCircle } from "ionicons/icons";
import React from "react";
import "./NotificationsModal.scss";

interface ContainerProps {
  isOpen: boolean;
  handleCloseModal: () => void;
}

const NotificationsModal: React.FC<ContainerProps> = ({
  isOpen,
  handleCloseModal,
}) => {
  return (
    <IonModal
      swipeToClose={true}
      isOpen={isOpen}
      cssClass="noti-modal"
      onDidDismiss={handleCloseModal}
      mode="ios"
    >
      <div className="noti-modal-wrapper">
        <IonItem className="noti-modal-title" lines="none">
          <b>Thông báo</b>
          <IonButton fill="clear" onClick={handleCloseModal} slot="end">
            <IonIcon
              color="dark"
              slot="icon-only"
              ios={closeOutline}
              md={closeSharp}
            />
          </IonButton>
        </IonItem>

        <IonItem button className="noti-modal-item" lines="none">
          <IonIcon slot="start" color="primary" icon={notificationsCircle} />
          <div className="noti-content">
            <b>Thông báo mới</b>
            <p>Bạn có thông báo mới</p>
          </div>
        </IonItem>
        <IonItem button className="noti-modal-item" lines="none">
          <IonIcon slot="start" color="primary" icon={notificationsCircle} />
          <div className="noti-content">
            <b>Bắt đầu bài học của bạn</b>
            <p>Tham gia các khóa học có sẵn hoặc tự tạo khóa học cho riêng mình</p>
          </div>
        </IonItem>
      </div>
    </IonModal>
  );
};

export default NotificationsModal;
