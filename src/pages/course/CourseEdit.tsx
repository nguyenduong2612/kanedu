import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonList,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import ErrorPage from "../../components/error_pages/ErrorPage";
import useAllLessons from "../../hooks/lesson/useAllLessons";
import "../../components/containers/LessonListContainer.scss";
import { trashOutline } from "ionicons/icons";
import { toast } from "../../utils/toast";
import { database } from "../../config/firebaseConfig";

interface CourseEditPageProps extends RouteComponentProps<MatchParams> {}

interface MatchParams {
  course_id: string;
}

const CourseEdit: React.FC<CourseEditPageProps> = ({ match }) => {
  const courseId = match.params.course_id;
  const lessons = useAllLessons(courseId);

  const handleDeleteLesson = async (lessonId: string) => {
    await database
      .collection("courses")
      .doc(courseId)
      .collection("lessons")
      .doc(lessonId)
      .delete();

    lessons.setLessonList(
      lessons.lessonList.filter((lesson) => lesson.id !== lessonId)
    );
    toast("Xóa bài học thành công");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Chỉnh sửa khóa học</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList style={{ height: "85vh" }} className="max-width-700">
          {lessons.isEmpty ? (
            <ErrorPage>Không có bài học</ErrorPage>
          ) : (
            <div className="lesson-list-wrapper">
              {lessons.lessonList.map((lesson: any, index: number) => {
                return (
                  <IonCard mode="md" className="lesson-wrapper" key={index}>
                    <IonCardHeader>
                      <IonCardTitle>
                        <span className="lesson-wrapper__title">
                          {lesson.title}
                        </span>
                        <br />
                        <span className="lesson-wrapper__size">
                          {lesson.numberOfCards} từ vựng
                        </span>
                      </IonCardTitle>

                      <IonButton
                        fill="clear"
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="lesson-wrapper__delete-btn"
                      >
                        <IonIcon
                          slot="icon-only"
                          color="danger"
                          icon={trashOutline}
                        ></IonIcon>
                      </IonButton>
                    </IonCardHeader>
                  </IonCard>
                );
              })}
            </div>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CourseEdit;
