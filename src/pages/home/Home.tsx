import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonMenuButton,
} from "@ionic/react";
import React, { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../../config/firebaseConfig";
import { setCourse } from "../../redux/reducers/coursesReducer";
import "./Home.css";

const CourseContainer = lazy(
  () => import("../../components/course/CourseContainer")
);

interface RootState {
  courses: any;
  user: any;
}

const Home: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getAllCourses() {
      const ref = database.collection("courses"); //TODO
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
          dispatch(setCourse(course));
        });
      }
    }

    getAllCourses();
  }, [dispatch]);

  const currentUser = useSelector((state: RootState) => state.user);
  const courseList = useSelector((state: RootState) => state.courses);

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

        {courseList.courses.map((course: any, index: number) => {
          return (
            <CourseContainer key={index} id={course.id} />
          )
        })}
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
