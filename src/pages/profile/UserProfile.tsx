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

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const UserProfile: React.FC<ContainerProps> = ({ match }) => {
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
          let course = {
            id: doc.id,
            author: doc.data().author,
            author_id: doc.data().author_id,
            name: doc.data().name,
            description: doc.data().description,
            followers: doc.data().followed_by?.length,
          };
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
          <IonTitle>Trang cá nhân</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="user-info">
          <IonRow className="row">
            <IonCol size="2" className="col">
              <div className="image-wrapper">
                <img
                  alt="profile-avatar"
                  id="profile-avatar"
                  src={userInfo.profileURL}
                />
              </div>
            </IonCol>
            <IonCol size="10" className="col">
              <p className="profile-name">{userInfo.name}</p>
            </IonCol>
          </IonRow>
        </div>

        {courses.length > 0 ? (
          <IonList>
            {courses.map((course: any, index: number) => {
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

export default UserProfile;
