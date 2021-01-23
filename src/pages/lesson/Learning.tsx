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
import useTabbar from "../../hooks/useTabbar";

const CardListContainer = lazy(
  () => import("../../components/containers/CardListContainer")
);

interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface LearningPageProps extends RouteComponentProps<MatchParams> {}

const Learning: React.FC<LearningPageProps> = ({ match }) => {
  const courseId = match.params.course_id;
  const lessonId = match.params.lesson_id;
  useTabbar();

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
          courseId={courseId}
          lessonId={lessonId}
        />
      </IonContent>
    </IonPage>
  );
};

export default Learning;
