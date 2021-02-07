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
import CourseContainer from "../../../components/containers/CourseContainer";
import ErrorPage from "../../../components/error_pages/ErrorPage";
import Refresher from "../../../components/Refresher";

interface RootState {
  courses: any;
}

interface MyCoursePageProps {}

const MyCourse: React.FC<MyCoursePageProps> = () => {
  const { createdCourses } = useSelector((state: RootState) => state.courses);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Khóa học của tôi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Refresher />
        {createdCourses.length > 0 ? (
          <IonList>
            {createdCourses.map((course: any, index: number) => {
              return (
                <CourseContainer
                  key={index}
                  id={course.id}
                  name={course.name}
                  author={course.author}
                  author_id={course.author_id}
                  description={course.description}
                  followers={course.followed_by.length}
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

export default MyCourse;
