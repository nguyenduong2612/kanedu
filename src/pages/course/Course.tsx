import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonItem,
  IonList,
  IonItemDivider,
  IonLabel,
  IonText,
  IonAlert,
} from "@ionic/react";
import {
  ellipsisVertical,
  ellipsisVerticalOutline,
  heart,
  personCircle,
  shareSocial,
} from "ionicons/icons";
import React, { useState, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { toast } from "../../utils/toast";
import "./Course.scss";
import ShareModal from "../../components/modals/ShareModal";
import Refresher from "../../components/utils/Refresher";
import useCourse from "../../hooks/course/useCourse";
import { Post } from "../../models/Post";
import {
  deleteCourse,
  followCourse,
  unfollowCourse,
} from "../../redux/courses/courses.actions";
import { savePost } from "../../redux/post/post.actions";
import Skeleton from "../../components/utils/Skeleton";

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

  const { user } = useSelector((state: RootState) => state.user);
  const { followingCourses, createdCourses } = useSelector(
    (state: RootState) => state.courses
  );
  const courseId = match.params.id;

  const course = useCourse(courseId);

  const dispatch = useDispatch();

  const handleFollow = () => {
    dispatch(followCourse(courseId, user.uid));
    course.setIsFollowed(true);
    setShowPopover(false);
    toast("Thẽo dõi khóa học thành công");
  };

  const handleUnfollow = () => {
    dispatch(unfollowCourse(followingCourses, courseId, user.uid));
    course.setIsFollowed(false);
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
    let post: Post = {
      author: user.name,
      author_id: user.uid,
      title: course.name,
      sharedLink: window.location.pathname,
      likes: 0,
      comments: 0,
      content: `Tham gia khóa học ${course.name} này cùng mình nhé !`,
      created_at: Date.now(),
    };

    dispatch(savePost(post, user.uid));

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
          <IonTitle>{course.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowPopover(true)}>
              <IonIcon
                color="light"
                slot="icon-only"
                ios={ellipsisVerticalOutline}
                md={ellipsisVertical}
              />
            </IonButton>

            <IonPopover
              isOpen={showPopover}
              cssClass="course-detail-popup"
              onDidDismiss={() => setShowPopover(false)}
            >
              <IonList>
                {course.isFollowed ? (
                  <IonItem onClick={handleUnfollow} lines="none">
                    Bỏ theo dõi
                  </IonItem>
                ) : (
                  <IonItem onClick={handleFollow} lines="none">
                    Theo dõi
                  </IonItem>
                )}
                <IonItem onClick={handleShowShareModal} lines="none">
                  Chia sẻ
                </IonItem>
                {createdCourses.filter((course: any) => course.id === courseId)
                  .length > 0 && (
                  <>
                    <IonItem
                      onClick={() => setShowPopover(false)}
                      routerLink={`/edit/${courseId}`}
                      lines="none"
                    >
                      Chỉnh sửa
                    </IonItem>
                    <IonItem onClick={handleDeleteCourse} lines="none">
                      <span className="text--red">Xóa khóa học</span>
                    </IonItem>
                  </>
                )}
              </IonList>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <Refresher />
        {course.isLoaded ? (
          <IonList className="course-info">
            <IonItem lines="none">
              <IonIcon icon={personCircle}></IonIcon>
              <IonText className="course-info__text">
                Được tạo bởi {course.author}
              </IonText>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={heart}></IonIcon>
              <IonText className="course-info__text">
                {course.countFollowers ? course.countFollowers : 0} người theo
                dõi khóa học này
              </IonText>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={shareSocial}></IonIcon>
              <IonText className="course-info__text">0 lượt chia sẻ</IonText>
            </IonItem>
          </IonList>
        ) : (
          <Skeleton />
        )}

        <IonItemDivider mode="md">
          <IonLabel color="dark">Danh sách bài học</IonLabel>
        </IonItemDivider>
        <LessonListContainer author={course.author} courseId={courseId} />
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
