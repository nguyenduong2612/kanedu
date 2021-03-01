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
  IonProgressBar,
} from "@ionic/react";
import {
  book,
  bookOutline,
  gameController,
  gameControllerOutline,
  pencil,
  pencilOutline,
} from "ionicons/icons";
import React, { lazy } from "react";
import { RouteComponentProps } from "react-router";
import Refresher from "../../components/utils/Refresher";
import Skeleton from "../../components/utils/Skeleton";
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

  const lesson: any = useLesson(courseId, lessonId);

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
            {lesson.isLoaded ? (
              <>
                <IonRow className="padding-x">
                  <h1 className="lesson-info__title">{lesson.title}</h1>
                </IonRow>
                <IonRow className="padding-x">
                  <p className="lesson-info__size">
                    {lesson.numberOfCards} từ vựng
                  </p>
                </IonRow>

                <IonRow className="lesson-info__row">
                  <IonCol>
                    <IonCard
                      className="menu-button"
                      button={true}
                      routerLink={`/courses/${courseId}/${lessonId}/study`}
                    >
                      <IonCardHeader className="menu-icon">
                        <IonIcon ios={bookOutline} md={book} />
                      </IonCardHeader>
                      <IonCardSubtitle className="menu-title">
                        Học
                      </IonCardSubtitle>
                    </IonCard>
                  </IonCol>
                  <IonCol>
                    <IonCard
                      className="menu-button"
                      button={true}
                      routerLink={`/courses/${courseId}/${lessonId}/test`}
                    >
                      <IonCardHeader className="menu-icon">
                        <IonIcon ios={pencilOutline} md={pencil} />
                      </IonCardHeader>
                      <IonCardSubtitle className="menu-title">
                        Kiểm tra
                      </IonCardSubtitle>
                    </IonCard>
                  </IonCol>
                  <IonCol>
                    <IonCard
                      className="menu-button"
                      button={true}
                      routerLink={`/courses/${courseId}/${lessonId}/match`}
                    >
                      <IonCardHeader className="menu-icon">
                        <IonIcon
                          ios={gameControllerOutline}
                          md={gameController}
                        />
                      </IonCardHeader>
                      <IonCardSubtitle className="menu-title">
                        Ghép thẻ
                      </IonCardSubtitle>
                    </IonCard>
                  </IonCol>
                </IonRow>

                <IonGrid style={{ padding: "25px 0" }}>
                  <IonRow className="padding-x">
                    <IonCol size="3">
                      <span>Đã thuộc</span>
                    </IonCol>
                    <IonCol size="7">
                      <IonProgressBar
                        className="lesson-info__progress-bar"
                        value={lesson.progress}
                      ></IonProgressBar>
                    </IonCol>
                    <IonCol size="2">
                      <span>
                        {lesson.progress * lesson.numberOfCards}/
                        {lesson.numberOfCards}
                      </span>
                    </IonCol>
                  </IonRow>
                  {/* <IonRow className="padding-x">
                    <IonCol size="3">
                      <span>Kiểm tra</span>
                    </IonCol>
                    <IonCol size="7">
                      <IonProgressBar
                        className="lesson-info__progress-bar"
                        value={0.5}
                      ></IonProgressBar>
                    </IonCol>
                    <IonCol size="2">
                      <span>123</span>
                    </IonCol>
                  </IonRow>
                  <IonRow className="padding-x">
                    <IonCol size="3">
                      <span>Ghép thẻ</span>
                    </IonCol>
                    <IonCol size="9">
                      <span>30 giây</span>
                    </IonCol>
                  </IonRow> */}
                </IonGrid>
              </>
            ) : (
              <Skeleton />
            )}
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Lesson;
