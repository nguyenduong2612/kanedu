import { IonCard, IonCardHeader, IonCardTitle, IonItem } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";
import ErrorPage from "../ErrorPage";

interface ContainerProps {
  courseId: string;
  author: string;
}

const LessonList: React.FC<ContainerProps> = ({
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
      const docs = await ref.get();
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
        <div style={{ paddingTop: 30 }}>
          {lessonList.map((lesson: any, index: number) => {
            return (
              <IonItem
                lines="none"
                key={index}
                routerLink={`/courses/${courseId}/${lesson.id}`}
              >
                <IonCard style={{ width: "100%" }}>
                  <IonCardHeader>
                    <IonCardTitle>{lesson.data().title}</IonCardTitle>
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

export default LessonList;
