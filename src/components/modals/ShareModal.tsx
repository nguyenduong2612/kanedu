import {
  IonActionSheet,
} from "@ionic/react";
import { shareSocial,  } from "ionicons/icons";
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
    <IonActionSheet
      isOpen={isOpen}
      cssClass="share-modal"
      header="Chia sẻ"
      onDidDismiss={handleCloseShareModal}
      mode="md"
      buttons={[
        {
          text: "Chía sẻ lên Cộng đồng",
          icon: shareSocial,
          handler: handleShare,
        },
      ]}
    ></IonActionSheet>
  );
};

export default ShareModal;
