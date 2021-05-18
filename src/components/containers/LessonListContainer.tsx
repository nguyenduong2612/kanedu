import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from "@ionic/react";
import { play } from "ionicons/icons";
import React from "react";
import useAllLessons from "../../hooks/lesson/useAllLessons";
import ErrorPage from "../error_pages/ErrorPage";
import Spinner from "../utils/Spinner";
import "./LessonListContainer.scss";

interface LessonListContainerProps {
  courseId: string;
  author: string;
}

const LessonListContainer: React.FC<LessonListContainerProps> = ({
  author,
  courseId,
}: LessonListContainerProps) => {
  const lessons = useAllLessons(courseId);

  return (
    <>
      {lessons.isEmpty ? (
        <ErrorPage>Không có bài học</ErrorPage>
      ) : lessons.isLoaded ? (
        <div className="lesson-list-wrapper">
          {lessons.lessonList.map((lesson: any, index: number) => {
            return (
              <IonCard
                key={index}
                mode="ios"
                className="lesson-wrapper"
                routerLink={`/courses/${courseId}/${lesson.id}`}
              >
                <IonGrid>
                  <IonRow>
                    <IonCol size="3">
                      <div className="lesson-wrapper__icon-bg">
                        <IonIcon icon={play} color="primary"></IonIcon>
                      </div>
                    </IonCol>
                    <IonCol size="9">
                      <IonCardHeader>
                        <IonCardTitle>
                          <span className="lesson-wrapper__title">
                            {lesson.title}
                          </span>
                          <br />
                          <span className="lesson-wrapper__size">
                            {lesson.numberOfCards} từ vựng
                          </span>
                        </IonCardTitle>
                      </IonCardHeader>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCard>
            );
          })}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default LessonListContainer;
