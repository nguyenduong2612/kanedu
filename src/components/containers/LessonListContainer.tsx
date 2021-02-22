import { IonCard, IonCardHeader, IonCardTitle, IonItem } from "@ionic/react";
import React from "react";
import useAllLessons from "../../hooks/lesson/useAllLessons";
import ErrorPage from "../error_pages/ErrorPage";
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
      ) : (
        <div className="lesson-list-wrapper">
          {lessons.lessonList.map((lesson: any, index: number) => {
            return (
              <IonItem
                lines="none"
                key={index}
                routerLink={`/courses/${courseId}/${lesson.id}`}
              >
                <IonCard mode="md" className="lesson-wrapper">
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
                </IonCard>
              </IonItem>
            );
          })}
        </div>
      )}
    </>
  );
};

export default LessonListContainer;
