import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonLabel,
  IonAlert,
  IonGrid,
  IonCol,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonRouterLink,
  IonActionSheet,
  useIonRouter,
} from "@ionic/react";
import {
  ellipsisVertical,
  ellipsisVerticalOutline,
  heart,
  heartDislike,
  pencil,
  share,
  trash,
} from "ionicons/icons";
import React, { useState, lazy, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { toast } from "../../utils/toast";
import "./Course.scss";
import ShareModal from "../../components/modals/ShareModal";
import Refresher from "../../components/utils/Refresher";
import {
  deleteCourse,
  followCourse,
  unfollowCourse,
} from "../../redux/courses/courses.actions";
import { savePost } from "../../redux/post/post.actions";
import { recommendCourses } from "../../helpers/recommenderHelper";
import CourseListContainer from "../../components/containers/CourseListContainer";

const LessonListContainer = lazy(
  () => import("../../components/containers/LessonListContainer")
);

interface MatchParams {
  id: string;
}

interface RootState {
  user: any;
  courses: any;
}

interface CoursePageProps extends RouteComponentProps<MatchParams> {}

const Course: React.FC<CoursePageProps> = ({ match }) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [segmentValue, setSegmentValue] = useState<string>("lessons");

  const [isFollowed, setIsFollowed] = useState<boolean>();
  const [recommendation, setRecommendation] = useState<any[]>([]);

  const { user } = useSelector((state: RootState) => state.user);
  const { followingCourses, createdCourses, courses } = useSelector(
    (state: RootState) => state.courses
  );
  const courseId = match.params.id;

  const course = courses.filter((course: any) => course.id === courseId)[0];

  const router = useIonRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getInfo() {
      var courseIndex = followingCourses
        .map((course: any) => {
          return course.id;
        })
        .indexOf(courseId);
      if (courseIndex !== -1) {
        setIsFollowed(true);
      }
    }

    function getRecommendCourses() {
      setRecommendation(recommendCourses(course, courses));
    }

    getInfo();
    getRecommendCourses();
  }, [followingCourses, courses, courseId, course]);

  const handleFollow = () => {
    dispatch(followCourse(courseId, user.uid));
    setIsFollowed(true);
    setShowPopover(false);
    toast("Thẽo dõi khóa học thành công");
  };

  const handleUnfollow = () => {
    dispatch(unfollowCourse(followingCourses, courseId, user.uid));
    setIsFollowed(false);
    setShowPopover(false);
    toast("Đã bỏ theo dõi khóa học");
  };

  const handleShowShareModal = () => {
    setShowShareModal(true);
    setShowPopover(false);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleShare = async () => {
    let postData = {
      author: user.name,
      author_id: user.uid,
      title: course.name,
      sharedLink: window.location.pathname,
      likes: 0,
      comments: 0,
      content: `Tham gia khóa học ${course.name} này cùng mình nhé !`,
      created_at: Date.now(),
    };

    dispatch(savePost(postData, user.uid));

    toast("Chia sẻ khóa học thành công");
    setShowShareModal(false);
  };

  const handleDeleteCourse = () => {
    setShowAlert(true);
    setShowPopover(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCourse(createdCourses, courseId, user.uid));
    toast("Đã xóa khóa học");
    window.history.back();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>

          <IonButtons slot="end">
            <IonButton onClick={() => setShowPopover(true)}>
              <IonIcon
                color="light"
                slot="icon-only"
                ios={ellipsisVerticalOutline}
                md={ellipsisVertical}
              />
            </IonButton>

            <IonActionSheet
              isOpen={showPopover}
              cssClass="course-detail-modal"
              onDidDismiss={() => setShowPopover(false)}
              buttons={
                course.author_id === user.uid
                  ? [
                      isFollowed
                        ? {
                            text: "Bỏ theo dõi",
                            icon: heartDislike,
                            handler: handleUnfollow,
                          }
                        : {
                            text: "Theo dõi",
                            icon: heart,
                            handler: handleFollow,
                          },
                      {
                        text: "Chia sẻ",
                        icon: share,
                        handler: handleShowShareModal,
                      },
                      {
                        text: "Chỉnh sửa",
                        icon: pencil,
                        handler: () => {
                          router.push(`/edit/${courseId}`)
                        },
                      },
                      {
                        text: "Xóa khóa học",
                        role: 'destructive',
                        icon: trash,
                        handler: handleDeleteCourse,
                      },
                    ]
                  : [
                      isFollowed
                        ? {
                            text: "Bỏ theo dõi",
                            icon: heartDislike,
                            handler: handleUnfollow,
                          }
                        : {
                            text: "Theo dõi",
                            icon: heart,
                            handler: handleFollow,
                          },
                      {
                        text: "Chia sẻ",
                        icon: share,
                        handler: handleShowShareModal,
                      },
                    ]
              }
            >
            </IonActionSheet>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <Refresher />

        <IonList className="course-info">
          <div className="max-width-700">
            <img
              className="course-info__doodle3"
              src="../../assets/images/doodle3.png"
              alt="doodle3"
            />
            {/* <img
              className="course-info__doodle4"
              src="../../assets/images/doodle4.png"
            /> */}
            <div className="course-info__title">
              <p>
                <b>{course.name}</b>
              </p>
            </div>
            <IonGrid className="course-info__detail">
              <IonRow>
                <IonCol size="6">
                  <span className="course-info__text">
                    tạo bởi{" "}
                    <IonRouterLink
                      color="light"
                      href={`/users/${course.author_id}`}
                    >
                      <b>{course.author}</b>
                    </IonRouterLink>
                  </span>
                </IonCol>
                <IonCol size="6">
                  <span className="course-info__text">
                    <b>
                      {course.followed_by.length
                        ? course.followed_by.length
                        : 0}
                    </b>{" "}
                    người theo dõi
                  </span>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonList>

        <IonSegment
          value={segmentValue}
          color="light"
          className="course-segment"
          onIonChange={(e: any) => setSegmentValue(e.detail.value!)}
          mode="md"
        >
          <IonSegmentButton value="lessons">
            <IonLabel>Danh sách bài học</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="recommendation">
            <IonLabel>Khóa học tương tự</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <div className="max-width-700">
          {segmentValue === "lessons" ? (
            <LessonListContainer author={course.author} courseId={courseId} />
          ) : (
            <CourseListContainer courses={recommendation} />
          )}
        </div>
      </IonContent>

      <ShareModal
        isOpen={showShareModal}
        handleCloseShareModal={handleCloseShareModal}
        handleShare={handleShare}
      />
      <IonAlert
        isOpen={showAlert}
        cssClass="alert"
        onDidDismiss={() => setShowAlert(false)}
        header={"Chú ý"}
        message={`Xác nhận xóa khóa học này. Thao tác này không thể hoàn tác.`}
        buttons={[
          {
            text: "Hủy",
          },
          {
            text: "Xác nhận",
            role: "confirm",
            cssClass: "text--red",
            handler: handleConfirmDelete,
          },
        ]}
      />
    </IonPage>
  );
};

export default Course;
