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
import React, { useState, useEffect, lazy } from "react";
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
import { algoliaUpdatePost } from "../../config/algoliaConfig";

const LessonList = lazy(() => import("../../components/lesson/LessonList"));

interface MatchParams {
  id: string;
}

interface RootState {
  user: any;
  courses: any;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const Course: React.FC<ContainerProps> = ({ match }) => {
  const [name, setName] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [authorId, setAuthorId] = useState<string>("");
  const [countFollowers, setCountFollowers] = useState<number>();

  const [followingCourseIndex, setFollowingCourseIndex] = useState<number>(-1);
  const [isFollowed, setIsFollowed] = useState<boolean>();
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const currentUser = useSelector((state: RootState) => state.user);
  const courseList = useSelector((state: RootState) => state.courses);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getInfo() {
      let ref = database.collection("courses").doc(match.params.id);
      let doc: any = await ref.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setName(doc.data().name);
        setAuthor(doc.data().author);
        setAuthorId(doc.data().author_id);
        setCountFollowers(doc.data().followed_by?.length)

        var course_index = courseList.courses
          .map((course: any) => {
            return course.id;
          })
          .indexOf(match.params.id);
        if (course_index !== -1) {
          setFollowingCourseIndex(course_index);
          setIsFollowed(true);
        }
      }
    }

    getInfo();
  }, [courseList.courses, match]);

  const handleFollow = () => {
    let course = {
      id: match.params.id,
      author: author,
      author_id: authorId,
      name: name,
    };
    dispatch(setFollowingCourses(course));

    let ref = database.collection("courses").doc(match.params.id);
    ref.update({
      followed_by: firebase.firestore.FieldValue.arrayUnion(
        currentUser.user.uid
      ),
    });

    setIsFollowed(true);
    setShowPopover(false);
    toast("Thẽo dõi khóa học thành công");
  };

  const handleUnfollow = () => {
    dispatch(removeFollowingCourses(followingCourseIndex));
    let ref = database.collection("courses").doc(match.params.id);
    ref.update({
      followed_by: firebase.firestore.FieldValue.arrayRemove(
        currentUser.user.uid
      ),
    });

    setFollowingCourseIndex(-1);
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
    let post = {
      author: currentUser.user.name,
      profileURL: currentUser.user.profileURL,
      title: name,
      sharedLink: window.location.pathname,
      content: `Tham gia khóa học ${name} này cùng mình nhé !`,
      created_at: Date.now(),
    };

    const res = await database.collection("posts").add(post);

    if (algoliaUpdatePost(post, res.id)) console.log("add algolia ok");

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
          <IonTitle>{name}</IonTitle>
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
                {isFollowed ? (
                  <IonItem onClick={handleUnfollow} lines="none">Bỏ theo dõi</IonItem>
                ) : (
                  <IonItem onClick={handleFollow} lines="none">Theo dõi</IonItem>
                )}
                <IonItem onClick={handleShowShareModal} lines="none">Chia sẻ</IonItem>
              </IonList>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList style={{ marginTop: 10 }}>
          <IonItem lines="none">
            <IonIcon icon={personCircle}></IonIcon>
            <IonText style={{ marginLeft: 10 }}>Được tạo bởi {author}</IonText>
          </IonItem>
          <IonItem lines="none">
            <IonIcon icon={heart}></IonIcon>
            <IonText style={{ marginLeft: 10 }}>
              {countFollowers ? countFollowers : 0} người theo dõi khóa học này
            </IonText>
          </IonItem>
          <IonItem lines="none">
            <IonIcon icon={shareSocial}></IonIcon>
            <IonText style={{ marginLeft: 10 }}>
              123123 lượt chia sẻ
            </IonText>
          </IonItem>
        </IonList>

        <IonItemDivider mode="md">
          <IonLabel color="dark">Danh sách bài học</IonLabel>
        </IonItemDivider>
        <LessonList author={author} courseId={match.params.id} />
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
