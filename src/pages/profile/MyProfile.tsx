import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonList,
  IonLabel,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonItemDivider,
  IonSegment,
  IonSegmentButton,
  IonCol,
  IonGrid,
  IonRow,
  IonProgressBar,
  IonItem,
} from "@ionic/react";
import { medalOutline, settings, settingsOutline } from "ionicons/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CourseListContainer from "../../components/containers/CourseListContainer";
import ErrorPage from "../../components/error_pages/ErrorPage";
import Spinner from "../../components/utils/Spinner";
import "./MyProfile.scss";

interface MyProfilePageProps {}

interface RootState {
  user: any;
  courses: any;
}

const MyProfile: React.FC<MyProfilePageProps> = () => {
  const [segmentValue, setSegmentValue] = useState<string>("statistics");

  const { user, isLoading } = useSelector((state: RootState) => state.user);
  const { createdCourses } = useSelector((state: RootState) => state.courses);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="light"
          ></IonMenuButton>

          <IonButtons slot="end">
            <IonButton routerLink="/my-profile/account-settings">
              <IonIcon
                color="light"
                slot="icon-only"
                ios={settingsOutline}
                md={settings}
              />
            </IonButton>
          </IonButtons>
          <IonTitle>Hồ sơ của tôi</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {isLoading ? (
          <Spinner />
        ) : (
          <IonGrid className="user-info max-width-700">
            <IonRow>
              <IonCol size="9">
                <h3 className="username">{user.name}</h3>
                <p className="level">
                  Cấp {Math.floor(user.exp / 100) + 1}
                </p>
                <IonProgressBar
                  className="exp-bar"
                  value={(user.exp % 100) / 100}
                ></IonProgressBar>
              </IonCol>
              <IonCol size="3">
                <div className="avatar-wrapper">
                  <img
                    alt="avatar"
                    className="user-profile"
                    src={user.profileURL}
                  />
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        <IonItemDivider mode="md" />
        <div className="user-data">
          <IonSegment
            value={segmentValue}
            color="primary"
            className="part-segment"
            onIonChange={(e: any) => setSegmentValue(e.detail.value!)}
          >
            <IonSegmentButton value="statistics">
              <IonLabel>Thống kê</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="courses">
              <IonLabel>Khóa học</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {segmentValue === "statistics" ? (
            <>
              <IonGrid className="statistics max-width-700">
                <IonRow className="part-title">Thống kê</IonRow>
                <IonRow>
                  <IonCol size="6">
                    <div className="statistics-div">
                      <b>{Math.floor(user.exp / 100) + 1}</b>
                      <br />
                      <span style={{ color: "#aaa" }}>Cấp</span>
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="statistics-div">
                      <b>{user.exp}</b>
                      <br />
                      <span style={{ color: "#aaa" }}>Điểm kinh nghiệm</span>
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="statistics-div">
                      <b>
                        {user.created_courses
                          ? user.created_courses.length
                          : 0}
                      </b>
                      <br />
                      <span style={{ color: "#aaa" }}>Số khóa học đã tạo</span>
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="statistics-div">
                      <b>
                        {user.created_posts
                          ? user.created_posts.length
                          : 0}
                      </b>
                      <br />
                      <span style={{ color: "#aaa" }}>Số bài đăng đã tạo</span>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonGrid className="achievements max-width-700">
                <IonRow className="part-title">Thành tựu</IonRow>
                <IonList>
                  {user.achievements &&
                    user.achievements.map(
                      (achievement: any, index: number) => {
                        return (
                          <IonItem key={index}>
                            <IonRow className="achievement-row">
                              <IonCol size="2">
                                <IonIcon
                                  className="achievement-icon"
                                  icon={medalOutline}
                                ></IonIcon>
                              </IonCol>
                              <IonCol size="10">
                                <span className="achievement-name">
                                  {achievement.name}
                                </span>
                                <span className="achievement-des">
                                  {achievement.description}
                                </span>
                              </IonCol>
                            </IonRow>
                          </IonItem>
                        );
                      }
                    )}
                </IonList>
              </IonGrid>
            </>
          ) : (
            <>
              {createdCourses.length > 0 ? (
                <IonList className="max-width-700">
                  <CourseListContainer courses={createdCourses} />
                </IonList>
              ) : (
                <ErrorPage>Không có dữ liệu</ErrorPage>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;
