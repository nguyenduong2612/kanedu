import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonItemDivider,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonItem,
  IonItemGroup,
  IonProgressBar,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import {
  add,
  chevronForward,
  notifications,
  notificationsOutline,
} from "ionicons/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CourseListContainer from "../../components/containers/CourseListContainer";
import HintContainer from "../../components/containers/HintContainer";
import ErrorPage from "../../components/error_pages/ErrorPage";
import CreateModal from "../../components/modals/CreateModal";
import NotificationsModal from "../../components/modals/NotificationsModal";
import Refresher from "../../components/utils/Refresher";
import "./Home.scss";

interface RootState {
  courses: any;
  user: any;
}

const Home: React.FC = () => {
  const { createdCourses, followingCourses } = useSelector(
    (state: RootState) => state.courses
  );
  const { isLoggedin, user } = useSelector((state: RootState) => state.user);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showNotiModal, setShowNotiModal] = useState<boolean>(false);

  const handleCloseNotiModal = () => {
    setShowNotiModal(false);
  };

  const handleShowModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
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
          {isLoggedin && (
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
                handleCloseModal={handleCloseNotiModal}
              ></NotificationsModal>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Refresher />
        <div className="max-width-700">
          {createdCourses.length === 0 && followingCourses.length === 0 && (
            <HintContainer />
          )}

          {user.goal && (
            <div className="section-wrapper">
              <IonItemGroup>
                <IonItem lines="none" style={{ fontSize: 14 }}>
                  <IonLabel className="goal-label">Mục tiêu hằng ngày</IonLabel>
                  <IonProgressBar
                    className="daily-object-bar"
                    value={
                      (user.dailyObject ? user.dailyObject : 0 % 100) /
                      user.goal
                    }
                  ></IonProgressBar>
                  {user.dailyObject ? user.dailyObject : 0}/{user.goal} thẻ
                </IonItem>
              </IonItemGroup>
            </div>
          )}

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
              <CourseListContainer courses={followingCourses.slice(0, 2)} />
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
              <CourseListContainer courses={createdCourses.slice(0, 2)} />
            ) : (
              <div className="error-msg">
                <ErrorPage>Bạn chưa tạo khóa học nào</ErrorPage>
              </div>
            )}
          </div>
        </div>
      </IonContent>
      {isLoggedin && (
        <IonFab id="tabbar-fab" vertical="bottom" horizontal="end">
          <IonFabButton onClick={handleShowModal} id="appFabBtn">
            <IonIcon icon={add} size="large" />
          </IonFabButton>
          <CreateModal
            isOpen={showCreateModal}
            handleCloseModal={handleCloseModal}
          />
        </IonFab>
      )}
    </IonPage>
  );
};

export default Home;
