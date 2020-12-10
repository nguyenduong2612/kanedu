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
} from "@ionic/react";
import {
  addOutline,
  addSharp,
  closeOutline,
  closeSharp,
} from "ionicons/icons";
import React, { useState, useEffect, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { database } from "../../config/firebaseConfig";
import * as firebase from "firebase/app";
import { removeFollowingCourses, setFollowingCourses } from "../../redux/reducers/coursesReducer";
import { toast } from "../../utils/toast";

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
  const [followingCourseIndex, setFollowingCourseIndex] = useState<number>(-1);
  const [isFollowed, setIsFollowed] = useState<boolean>();

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
    toast("Đã bỏ theo dõi khóa học");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/" />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
          <IonButtons slot="end">
            {isFollowed ? (
              <IonButton onClick={handleUnfollow}>
                <IonIcon
                  color="dark"
                  slot="icon-only"
                  ios={closeOutline}
                  md={closeSharp}
                />
              </IonButton>
            ) : (
              <IonButton onClick={handleFollow}>
                <IonIcon
                  color="dark"
                  slot="icon-only"
                  ios={addOutline}
                  md={addSharp}
                />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <LessonList author={author} courseId={match.params.id} />
      </IonContent>
    </IonPage>
  );
};

export default Course;
