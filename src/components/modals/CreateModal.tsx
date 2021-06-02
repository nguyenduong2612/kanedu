import { IonActionSheet, useIonRouter } from "@ionic/react";
import {
  book,
  library,
} from "ionicons/icons";
import React from "react";
import "./CreateModal.scss";

interface CreateModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  handleCloseModal,
}) => {
  const router = useIonRouter();

  return (
    <IonActionSheet
      isOpen={isOpen}
      cssClass="create-modal"
      onDidDismiss={handleCloseModal}
      header="Tạo"
      mode="md"
      buttons={[{
        text: 'Tạo khóa học',
        icon: library,
        handler: () => {
         router.push("/courses/create");
        }
      },
      {
        text: 'Tạo bài học',
        icon: book,
        handler: () => {
          router.push("/courses/choose");
        }
      }
      ]}
    >
    </IonActionSheet>
  );
};

export default CreateModal;
