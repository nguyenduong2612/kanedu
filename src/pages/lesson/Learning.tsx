import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonTitle,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import CardListContainer from "../../components/containers/CardListContainer";
import useTabbar from "../../hooks/useTabbar";
import "./Learning.scss";
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
          <IonTitle>Học</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="bg-white">
        <div className="card-list-wrapper">
          <CardListContainer courseId={courseId} lessonId={lessonId} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Learning;
