import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonCardHeader,
  IonIcon,
  IonCardSubtitle,
} from "@ionic/react";
import {
  bookOutline,
  bookSharp,
  pencilOutline,
  pencilSharp,
} from "ionicons/icons";
import React, { lazy } from "react";
import { RouteComponentProps } from "react-router";
import Refresher from "../../components/Refresher";
import useLesson from "../../hooks/lesson/useLesson";
import "./Lesson.scss";

const CardPreviewContainer = lazy(
  () => import("../../components/containers/CardPreviewContainer")
);
interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface LessonPageProps extends RouteComponentProps<MatchParams> {}

const Lesson: React.FC<LessonPageProps> = ({ match }) => {
  const courseId = match.params.course_id;
  const lessonId = match.params.lesson_id;

  const lesson = useLesson(courseId, lessonId);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton
              color="light"
              text=""
              defaultHref={`/courses/${courseId}`}
            />
          </IonButtons>
          <IonTitle>{lesson.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <Refresher />
        <div className="cards-preview">
          <CardPreviewContainer
            courseId={match.params.course_id}
            lessonId={match.params.lesson_id}
          />
        </div>
        <div className="lesson-info">
          <IonGrid>
            <IonRow className="padding-x">
              <h1 className="lesson-info__title">{lesson.title}</h1>
            </IonRow>
            <IonRow className="padding-x">
              <p className="lesson-info__size">
              {lesson.numberOfCards} từ vựng
              </p>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonCard
                  className="menu-button"
                  button={true}
                  routerLink={`/courses/${courseId}/${lessonId}/study`}
                >
                  <IonCardHeader className="menu-icon">
                    <IonIcon ios={bookOutline} md={bookSharp} />
                  </IonCardHeader>
                  <IonCardSubtitle className="menu-title">Học</IonCardSubtitle>
                </IonCard>
              </IonCol>
              <IonCol>
                <IonCard
                  className="menu-button"
                  button={true}
                  routerLink={`/courses/${courseId}/${lessonId}/test`}
                >
                  <IonCardHeader className="menu-icon">
                    <IonIcon ios={pencilOutline} md={pencilSharp} />
                  </IonCardHeader>
                  <IonCardSubtitle className="menu-title">
                    Kiểm tra
                  </IonCardSubtitle>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Lesson;
