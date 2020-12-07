import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItem,
} from "@ionic/react";
import React from "react";

interface ContainerProps {
  id: string;
  name: string;
}

const CourseContainer: React.FC<ContainerProps> = ({ id, name }: ContainerProps) => {

  return (
    <IonItem lines="none" routerLink={`/courses/${id}`}>
      <IonCard style={{ width: "100%" }}>
        <IonCardHeader>
          <IonCardTitle>{name}</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </IonItem>
  );
};

export default CourseContainer;
