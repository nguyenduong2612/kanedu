import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonList,
  IonItemDivider,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { chevronForward } from "ionicons/icons";
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
            description: doc.data().description,
            followers: doc.data().followed_by?.length,
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
            description: doc.data().description,
            followers: doc.data().followed_by?.length,
          };
          dispatch(setMyCourses(course));
        });
      }
    }

    getFollowingCourses();
    getMyCourses();
  }, [currentUser.user.uid, dispatch]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="light"
          ></IonMenuButton>
          <IonTitle>Trang chủ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItemDivider mode="md">
            <IonLabel color="dark">
              <b>Đang theo dõi</b>
            </IonLabel>
            <IonButton
              mode="ios"
              slot="end"
              size="small"
              fill="clear"
              routerLink="/home/following-courses"
            >
              <IonLabel>
                <b>
                  Xem tất cả <IonIcon icon={chevronForward}></IonIcon>
                </b>
              </IonLabel>
            </IonButton>
          </IonItemDivider>
          {courseList.courses.slice(0, 2).map((course: any, index: number) => {
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

          <IonItemDivider mode="md">
            <IonLabel color="dark">
              <b>Khóa học của tôi</b>
            </IonLabel>
            <IonButton
              mode="ios"
              slot="end"
              size="small"
              fill="clear"
              routerLink="/home/my-courses"
            >
              <IonLabel>
                <b>
                  Xem tất cả <IonIcon icon={chevronForward}></IonIcon>
                </b>
              </IonLabel>
            </IonButton>
          </IonItemDivider>
          {courseList.my_courses
            .slice(0, 2)
            .map((course: any, index: number) => {
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
      </IonContent>
    </IonPage>
  );
};

export default Home;
