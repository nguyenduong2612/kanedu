import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonItem,
  IonItemGroup,
  IonProgressBar,
  IonFab,
  IonFabButton,
  IonSegment,
  IonSegmentButton,
  IonFabList,
  useIonRouter,
} from "@ionic/react";
import { add, notifications, book, library } from "ionicons/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CourseListContainer from "../../components/containers/CourseListContainer";
import HintContainer from "../../components/containers/HintContainer";
import ErrorPage from "../../components/error_pages/ErrorPage";
import NotificationsModal from "../../components/modals/NotificationsModal";
import Refresher from "../../components/utils/Refresher";
import "./Home.scss";

interface RootState {
  courses: any;
  user: any;
}

const Home: React.FC = () => {
  const router = useIonRouter(); 

  const { createdCourses, followingCourses } = useSelector(
    (state: RootState) => state.courses
  );
  const { isLoggedin, user } = useSelector((state: RootState) => state.user);

  const [segmentValue, setSegmentValue] = useState<string>("following");
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [showNotiModal, setShowNotiModal] = useState<boolean>(false);
  const now = new Date();

  const handleCloseNotiModal = () => {
    setShowNotiModal(false);
  };

  const toggleBackdrop = () => {
    showBackdrop ? setShowBackdrop(false) : setShowBackdrop(true);
  };

  const handleClickBackdrop = () => {
    setShowBackdrop(false);
    document.getElementById("homeFabBtn")?.click();
  };

  // const handleShowModal = () => {
  //   setShowCreateModal(true);
  // };

  // const handleCloseModal = () => {
  //   setShowCreateModal(false);
  // };

  return (
    <IonPage>
      <div
        className={`backdrop-${showBackdrop}`}
        onClick={() => handleClickBackdrop()}
      ></div>
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
                <IonIcon color="light" slot="icon-only" icon={notifications} />
              </IonButton>

              <NotificationsModal
                isOpen={showNotiModal}
                handleCloseModal={handleCloseNotiModal}
              ></NotificationsModal>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="bg-white">
        <Refresher />
        <div className="max-width-700">
          {createdCourses.length === 0 && followingCourses.length === 0 ? (
            <HintContainer />
          ) : (
            <div className="section-wrapper greeting">
              <IonItemGroup>
                {now.getHours() < 12 && now.getHours() > 4 ? (
                  <h2>おはよう</h2>
                ) : now.getHours() >= 12 && now.getHours() < 19 ? (
                  <h2>こんにちは</h2>
                ) : (
                  <h2>こんばんは</h2>
                )}

                <p className="greeting__text">
                  Chọn một khóa học để ôn tập nào
                </p>
                <div className="avatar-wrapper">
                  <img
                    alt="avatar"
                    className="user-profile"
                    src={user.profileURL}
                    onClick={() => router.push("/my-profile") }
                  />
                </div>
              </IonItemGroup>

              {user.goal && (
                <IonItemGroup>
                  <IonItem lines="none" className="goal">
                    <IonLabel>Mục tiêu</IonLabel>
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
              )}
            </div>
          )}

          <div className="section-wrapper">
            <IonSegment
              mode="md"
              value={segmentValue}
              color="primary"
              className="home-segment"
              onIonChange={(e: any) => setSegmentValue(e.detail.value!)}
            >
              <IonSegmentButton value="created">
                <IonLabel>Khóa học của tôi</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="following">
                <IonLabel>Đang theo dõi</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {segmentValue === "following" ? (
              followingCourses.length > 0 ? (
                <div className="course-list-wrapper">
                  <CourseListContainer courses={followingCourses.slice(0, 4)} />
                  <IonButton
                    expand="block"
                    color="primary"
                    fill="clear"
                    routerLink="/home/following-courses"
                  >
                    <b>Xem tất cả</b>
                  </IonButton>
                </div>
              ) : (
                <div className="error-msg course-list-wrapper">
                  <ErrorPage>Bạn chưa theo dõi khóa học nào</ErrorPage>
                </div>
              )
            ) : createdCourses.length > 0 ? (
              <div className="course-list-wrapper">
                <CourseListContainer courses={createdCourses.slice(0, 4)} />
                <IonButton
                  expand="block"
                  color="primary"
                  fill="clear"
                  routerLink="/home/my-courses"
                >
                  <b>Xem tất cả</b>
                </IonButton>
              </div>
            ) : (
              <div className="error-msg course-list-wrapper">
                <ErrorPage>Bạn chưa tạo khóa học nào</ErrorPage>
              </div>
            )}
          </div>
        </div>
      </IonContent>

      {isLoggedin && (
        <IonFab id="home-fab" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => toggleBackdrop()} id="homeFabBtn">
            <IonIcon icon={add} size="large" />
          </IonFabButton>
          <IonFabList side="top">
            <div className="fab-label__lesson">Tạo bài học</div>
            <IonFabButton
              routerLink="/courses/choose"
              onClick={() => setShowBackdrop(false)}
            >
              <IonIcon icon={book} />
            </IonFabButton>
            <div className="fab-label__course">Tạo khóa học</div>
            <IonFabButton
              routerLink="/courses/create"
              onClick={() => setShowBackdrop(false)}
            >
              <IonIcon icon={library} />
            </IonFabButton>
          </IonFabList>

          {/* <CreateModal
            isOpen={showCreateModal}
            handleCloseModal={handleCloseModal}
          /> */}
        </IonFab>
      )}
    </IonPage>
  );
};

export default Home;
