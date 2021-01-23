import {
  IonButton,
  IonCol,
  IonIcon,
  IonItem,
  IonModal,
  IonRow,
} from "@ionic/react";
import { logoFacebook, shareSocial, shareSocialOutline } from "ionicons/icons";
import React from "react";
import "./ShareModal.scss";

interface ShareModalProps {
  isOpen: boolean;
  handleCloseShareModal: () => void;
  handleShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  handleCloseShareModal,
  handleShare,
}) => {
  return (
    <IonModal
      swipeToClose={true}
      isOpen={isOpen}
      cssClass="share-modal"
      onDidDismiss={handleCloseShareModal}
      mode="ios"
    >
      <div className="share-modal-wrapper">
        <IonItem className="share-modal-item" lines="none">
          Chia sẻ
        </IonItem>
        <IonItem className="share-modal-item" lines="none">
          <IonRow>
            <IonCol size="2">
              <IonButton fill="clear" onClick={handleShare}>
                <IonIcon
                  color="dark"
                  slot="icon-only"
                  size="large"
                  ios={shareSocialOutline}
                  md={shareSocial}
                />
              </IonButton>
            </IonCol>
            <IonCol size="2">
              <IonButton fill="clear">
                <IonIcon
                  color="dark"
                  slot="icon-only"
                  size="large"
                  icon={logoFacebook}
                />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonItem>
      </div>
    </IonModal>
  );
};

export default ShareModal;
