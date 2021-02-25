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
  camera,
  chevronForward,
  notifications,
  notificationsOutline,
} from "ionicons/icons";
import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import HintContainer from "../../components/containers/HintContainer";
import ErrorPage from "../../components/error_pages/ErrorPage";
import NotificationsModal from "../../components/modals/NotificationsModal";
import Refresher from "../../components/utils/Refresher";
import "./Home.scss";

const CourseContainer = lazy(
  () => import("../../components/containers/CourseContainer")
);

interface RootState {
  courses: any;
}

const Home: React.FC = () => {
  const { createdCourses, followingCourses } = useSelector((state: RootState) => state.courses);

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
            <IonButton routerLink="/ocr">
              <IonIcon
                color="light"
                slot="icon-only"
                icon={camera}
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
          {createdCourses.length === 0 &&
            followingCourses.length === 0 && <HintContainer />}
            
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
            {followingCourses.length > 0 ? (
              followingCourses
                .slice(0, 2)
                .map((course: any, index: number) => {
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
            {createdCourses.length > 0 ? (
              createdCourses
                .slice(0, 2)
                .map((course: any, index: number) => {
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
