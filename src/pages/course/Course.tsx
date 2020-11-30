import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import React, { useState, useEffect, lazy } from "react";
import { RouteComponentProps } from "react-router";
import { database } from "../../config/firebaseConfig";

const LessonList = lazy(() => import("../../components/lesson/LessonList"));

interface MatchParams {
  id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const Course: React.FC<ContainerProps> = ({ match }) => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    async function getInfo() {
      const ref = database.collection("courses").doc(match.params.id);
      const doc: any = await ref.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setName(doc.data().name);
      }
    }

    getInfo();
  }, [match]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/" />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <LessonList courseId={match.params.id} />
      </IonContent>
    </IonPage>
  );
};

export default Course;
