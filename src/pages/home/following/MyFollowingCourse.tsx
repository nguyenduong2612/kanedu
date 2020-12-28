import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonList,
} from "@ionic/react";
import React from "react";
import { useSelector } from "react-redux";
import CourseContainer from "../../../components/course/CourseContainer";
import ErrorPage from "../../../components/ErrorPage";

interface RootState {
  courses: any;
}

interface ContainerProps {}

const MyFollowingCourse: React.FC<ContainerProps> = () => {
  const courseList = useSelector((state: RootState) => state.courses);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Khóa học đang theo dõi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {courseList.courses.length > 0 ? (
          <IonList>
            {courseList.courses.map((course: any, index: number) => {
              return (
                <CourseContainer
                  key={index}
                  id={course.id}
                  name={course.name}
                  author={course.author}
                  description={course.description}
                  followers={course.followers}
                />
              );
            })}
          </IonList>
        ) : (
          <ErrorPage>Không có dữ liệu</ErrorPage>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyFollowingCourse;