import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonMenuButton,
  IonList,
  IonItemDivider,
  IonLabel,
} from "@ionic/react";
import React, { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../config/firebaseConfig";
import {
  setFollowingCourses,
  setMyCourses,
} from "../../redux/reducers/coursesReducer";
import "./Home.css";

const CourseContainer = lazy(
  () => import("../../components/course/CourseContainer")
);

interface RootState {
  courses: any;
  my_courses: any;
  user: any;
}

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const courseList = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    async function getFollowingCourses() {
      const ref = database
        .collection("courses")
        .where("followed_by", "array-contains", currentUser.user.uid);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let course = {
            id: doc.id,
            author: doc.data().author,
            author_id: doc.data().author_id,
            name: doc.data().name,
          };
          dispatch(setFollowingCourses(course));
        });
      }
    }

    async function getMyCourses() {
      const ref = database
        .collection("courses")
        .where("author_id", "==", currentUser.user.uid);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let course = {
            id: doc.id,
            author: doc.data().author,
            author_id: doc.data().author_id,
            name: doc.data().name,
          };
          dispatch(setMyCourses(course));
        });
      }
    }

    getFollowingCourses();
    getMyCourses();
  }, [dispatch]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="dark"
          ></IonMenuButton>
          <IonTitle>Trang chủ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem lines="none">
          <p>{currentUser.user.email}</p>
        </IonItem>

        <IonList>
          <IonItemDivider mode="md">
            <IonLabel color="dark">Đang theo dõi</IonLabel>
          </IonItemDivider>
          {courseList.courses.map((course: any, index: number) => {
            return (
              <CourseContainer key={index} id={course.id} name={course.name} />
            );
          })}

          <IonItemDivider mode="md">
            <IonLabel color="dark">Khóa học của tôi</IonLabel>
          </IonItemDivider>
          {courseList.my_courses.map((course: any, index: number) => {
            return (
              <CourseContainer key={index} id={course.id} name={course.name} />
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
