import { IonCard, IonCardHeader, IonCardTitle, IonItem } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";
import ErrorPage from "../error_pages/ErrorPage";

interface ContainerProps {
  courseId: string;
  author: string;
}

const LessonListContainer: React.FC<ContainerProps> = ({
  author,
  courseId,
}: ContainerProps) => {
  const [lessonList, setLessonList] = useState<any[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>();

  useEffect(() => {
    async function getAllLesson() {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons");
      const docs = await ref.orderBy("created_at", "asc").get();
      if (docs.empty) {
        console.log("No such document!");
        setIsEmpty(true);
      } else {
        docs.forEach((doc) => {
          setLessonList((lessonList) => [...lessonList, doc]);
        });
      }
    }

    getAllLesson();
  }, [courseId]);

  return (
    <>
      {isEmpty ? (
        <ErrorPage>Không có bài học</ErrorPage>
      ) : (
        <div style={{ paddingTop: 10 }}>
          {lessonList.map((lesson: any, index: number) => {
            return (
              <IonItem
                lines="none"
                key={index}
                routerLink={`/courses/${courseId}/${lesson.id}`}
              >
                <IonCard mode="md" style={{ width: "100%" }}>
                  <IonCardHeader>
                    <IonCardTitle><b>{lesson.data().title}</b></IonCardTitle>
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
