import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import React, { lazy } from "react";
import { RouteComponentProps } from "react-router";

const CardList = lazy(() => import("../../components/cards/CardList"));

interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const Learning: React.FC<ContainerProps> = ({ match }) => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <CardList
          courseId={match.params.course_id}
          lessonId={match.params.lesson_id}
        />
      </IonContent>
    </IonPage>
  );
};

export default Learning;
