import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonLabel,
  IonList,
} from "@ionic/react";
import React from "react";
import { useSelector } from "react-redux";

interface CreateLessonPageProps {}
interface RootState {
  courses: any;
}

const CreateLesson: React.FC<CreateLessonPageProps> = () => {
  const { createdCourses } = useSelector((state: RootState) => state.courses);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>

          <IonTitle>Chọn khóa học</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="max-width-700">
          <IonItem lines="none">
            <IonLabel>Khóa học của tôi</IonLabel>
          </IonItem>
          {createdCourses.map((course: any, index: number) => {
            return (
              <IonItem
                key={index}
                lines="none"
                routerLink={`/lesson/create/${course.id}`}
              >
                <IonCard style={{ width: "100%" }}>
                  <IonCardHeader>
                    <IonCardTitle>{course.name}</IonCardTitle>
                  </IonCardHeader>
                </IonCard>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateLesson;
