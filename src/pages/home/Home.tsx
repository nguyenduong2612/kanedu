import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonMenuButton,
} from "@ionic/react";
import React, { lazy } from "react";
import "./Home.css";

const CourseContainer = lazy(
  () => import("../../components/course/CourseContainer")
);

const Home: React.FC = (props) => {
  const user: any = props;

  //console.log(user.email)
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
          <p>{user.email}</p>
        </IonItem>

        <CourseContainer id={"7Rs1TV3r2jPqKH7cJQYR"} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
