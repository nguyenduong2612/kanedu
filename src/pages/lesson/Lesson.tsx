import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonLoading,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import CardList from "../../components/cards/CardList";
import { database } from "../../config/firebaseConfig";

interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const Lesson: React.FC<ContainerProps> = ({ match }) => {
  const [busy, setBusy] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    async function getInfo() {
      const ref = database
        .collection("courses")
        .doc(match.params.course_id)
        .collection("lessons")
        .doc(match.params.lesson_id);
      const doc: any = await ref.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setName(doc.data().title);
      }
    }

    getInfo();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              color="dark"
              defaultHref={`/courses/${match.params.course_id}`}
            />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait" duration={0} isOpen={busy} />
      <IonContent fullscreen>
        <CardList
          courseId={match.params.course_id}
          lessonId={match.params.lesson_id}
        />
      </IonContent>
    </IonPage>
  );
};

export default Lesson;
