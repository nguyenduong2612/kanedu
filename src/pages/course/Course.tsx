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
import { database } from "../../config/firebaseConfig";
import * as firebase from "firebase/app";
import {
  removeFollowingCourses,
  setFollowingCourses,
} from "../../redux/reducers/coursesReducer";
import { toast } from "../../utils/toast";
import "./Course.scss";
import ShareModal from "../../components/modals/ShareModal";
import { algoliaUpdatePost } from "../../helpers/algoliaHelper";
import Refresher from "../../components/Refresher";
import useCourse from "../../hooks/course/useCourse";
import { Post } from "../../modals/Post";

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

  const currentUser = useSelector((state: RootState) => state.user);
  const courseId = match.params.id;

  const course = useCourse(courseId);

  const dispatch = useDispatch();

  const handleFollow = () => {
    let newFollow = {
      id: courseId,
      author: course.author,
      author_id: course.authorId,
      name: course.name,
    };
    dispatch(setFollowingCourses(newFollow));

    let ref = database.collection("courses").doc(courseId);
    ref.update({
      followed_by: firebase.firestore.FieldValue.arrayUnion(
        currentUser.user.uid
      ),
    });
    ref.update({
      followers: firebase.firestore.FieldValue.increment(1),
    });

    let userRef = database.collection("users").doc(currentUser.user.uid);
    userRef.update({
      following_courses: firebase.firestore.FieldValue.arrayUnion(courseId),
    });

    course.setIsFollowed(true);
    setShowPopover(false);
    toast("Thẽo dõi khóa học thành công");
  };

  const handleUnfollow = () => {
    dispatch(removeFollowingCourses(course.followingCourseIndex));
    let ref = database.collection("courses").doc(courseId);
    ref.update({
      followed_by: firebase.firestore.FieldValue.arrayRemove(
        currentUser.user.uid
      ),
    });
    ref.update({
      followers: firebase.firestore.FieldValue.increment(-1),
    });

    let userRef = database.collection("users").doc(currentUser.user.uid);
    userRef.update({
      following_courses: firebase.firestore.FieldValue.arrayRemove(courseId),
    });

    course.setFollowingCourseIndex(-1);
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
      author: currentUser.user.name,
      author_id: currentUser.user.uid,
      title: course.name,
      sharedLink: window.location.pathname,
      likes: 0,
      comments: 0,
      content: `Tham gia khóa học ${course.name} này cùng mình nhé !`,
      created_at: Date.now(),
    };

    const res = await database.collection("posts").add(post);

    if (await algoliaUpdatePost(post, res.id)) console.log("add algolia ok");

    toast("Chia sẻ khóa học thành công");
    setShowShareModal(false);
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
              </IonList>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <Refresher />
        <IonList style={{ marginTop: 10 }}>
          <IonItem lines="none">
            <IonIcon icon={personCircle}></IonIcon>
            <IonText style={{ marginLeft: 10 }}>
              Được tạo bởi {course.author}
            </IonText>
          </IonItem>
          <IonItem lines="none">
            <IonIcon icon={heart}></IonIcon>
            <IonText style={{ marginLeft: 10 }}>
              {course.countFollowers ? course.countFollowers : 0} người theo dõi
              khóa học này
            </IonText>
          </IonItem>
          <IonItem lines="none">
            <IonIcon icon={shareSocial}></IonIcon>
            <IonText style={{ marginLeft: 10 }}>0 lượt chia sẻ</IonText>
          </IonItem>
        </IonList>

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
    </IonPage>
  );
};

export default Course;
