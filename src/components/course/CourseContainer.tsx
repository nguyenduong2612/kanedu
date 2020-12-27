import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { heart } from "ionicons/icons";
import React from "react";
import "./CourseContainer.scss";

interface ContainerProps {
  id: string;
  name: string;
  author: string;
  description: string;
  followers: number;
}

const CourseContainer: React.FC<ContainerProps> = ({
  id,
  name,
  author,
  description,
  followers,
}: ContainerProps) => {
  return (
    <IonItem lines="none" routerLink={`/courses/${id}`}>
      <IonCard mode="md" className="course-wrapper">
        <IonCardHeader>
          <IonCardSubtitle mode="ios">{author}</IonCardSubtitle>
          <IonCardTitle>
            <b>{name}</b>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>{description}</IonCardContent>

        <IonButton size="default" fill="clear">
          <IonIcon slot="icon-only" icon={heart} />
          <IonLabel style={{ paddingLeft: 5 }}>{followers ? followers : 0}</IonLabel>
        </IonButton>

      </IonCard>
    </IonItem>
  );
};

export default CourseContainer;
