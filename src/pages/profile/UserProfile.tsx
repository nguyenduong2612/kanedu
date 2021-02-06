import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonList,
  IonCol,
  IonRow,
  IonGrid,
  IonItemDivider,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import CourseContainer from "../../components/containers/CourseContainer";
import ErrorPage from "../../components/error_pages/ErrorPage";
import { database } from "../../config/firebaseConfig";
import "./UserProfile.scss";

interface MatchParams {
  uid: string;
}

interface UserProfilePageProps extends RouteComponentProps<MatchParams> {}

const UserProfile: React.FC<UserProfilePageProps> = ({ match }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    async function getCourses() {
      const ref = database
        .collection("courses")
        .where("author_id", "==", match.params.uid);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let course = doc.data();
          course.id = doc.id;
          setCourses((courses) => [...courses, course]);
        });
      }
    }

    async function getUserInfo() {
      const doc: any = await database
        .collection("users")
        .doc(match.params.uid)
        .get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        let userInfo = {
          uid: doc.id,
          email: doc.data().email,
          name: doc.data().name,
          birthday: doc.data().birthday,
          profileURL: doc.data().profileURL,
        };
        setUserInfo(userInfo);
      }
    }

    getCourses();
    getUserInfo();
  }, [match.params.uid]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Hồ sơ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className="user-info">
          <IonRow>
            <IonCol size="9">
              <h3 className="username">{userInfo.name}</h3>
            </IonCol>
            <IonCol size="3">
              <div className="avatar-wrapper">
                <img
                  alt="avatar"
                  className="user-profile"
                  src={userInfo.profileURL}
                />
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonItemDivider mode="md" />

        {courses.length > 0 ? (
          <IonList>
            {courses.map((course: any, index: number) => {
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

export default UserProfile;
