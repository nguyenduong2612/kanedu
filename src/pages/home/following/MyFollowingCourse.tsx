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
import Refresher from "../../../components/utils/Refresher";

interface RootState {
  courses: any;
}

interface MyFollowingCoursePageProps {}

const MyFollowingCourse: React.FC<MyFollowingCoursePageProps> = () => {
  const { followingCourses } = useSelector((state: RootState) => state.courses);

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
        <Refresher />
        {followingCourses.length > 0 ? (
          <IonList>
            {followingCourses.map((course: any, index: number) => {
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

export default MyFollowingCourse;
