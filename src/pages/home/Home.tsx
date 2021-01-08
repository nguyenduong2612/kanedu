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
  IonButtons,
} from "@ionic/react";
import {
  chevronForward,
  notifications,
  notificationsOutline,
} from "ionicons/icons";
import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import HintContainer from "../../components/containers/HintContainer";
import ErrorPage from "../../components/ErrorPage";
import NotificationsModal from "../../components/modals/NotificationsModal";
import Refresher from "../../components/Refresher";
import "./Home.scss";

const CourseContainer = lazy(
  () => import("../../components/course/CourseContainer")
);

interface RootState {
  courses: any;
  my_courses: any;
  user: any;
}

const Home: React.FC = () => {
  const courseList = useSelector((state: RootState) => state.courses);

  const [showNotiModal, setShowNotiModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setShowNotiModal(false);
  };

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
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotiModal(true)}>
              <IonIcon
                color="light"
                slot="icon-only"
                ios={notificationsOutline}
                md={notifications}
              />
            </IonButton>

            <NotificationsModal
              isOpen={showNotiModal}
              handleCloseModal={handleCloseModal}
            ></NotificationsModal>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Refresher />
        <IonList>
          {courseList.courses.length === 0 &&
            courseList.my_courses.length === 0 && <HintContainer />}
            
          <div className="section-wrapper">
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
            {courseList.courses.length > 0 ? (
              courseList.courses
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
                })
            ) : (
              <div className="error-msg">
                <ErrorPage>Bạn chưa theo dõi khóa học nào</ErrorPage>
              </div>
            )}
          </div>

          <div className="section-wrapper">
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
            {courseList.my_courses.length > 0 ? (
              courseList.my_courses
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
                })
            ) : (
              <div className="error-msg">
                <ErrorPage>Bạn chưa tạo khóa học nào</ErrorPage>
              </div>
            )}
          </div>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
