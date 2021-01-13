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

const CardListContainer = lazy(() => import("../../components/containers/CardListContainer"));

interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const Learning: React.FC<ContainerProps> = ({ match }) => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <CardListContainer
          courseId={match.params.course_id}
          lessonId={match.params.lesson_id}
        />
      </IonContent>
    </IonPage>
  );
};

export default Learning;
