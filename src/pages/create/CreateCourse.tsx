import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonIcon,
  IonTextarea,
} from "@ionic/react";
import { checkmarkOutline, checkmarkSharp } from "ionicons/icons";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "../../utils/toast";
import { createCourse } from "../../redux/courses/courses.actions";

interface CreateCoursePageProps {}
interface RootState {
  user: any;
}

const CreateCourse: React.FC<CreateCoursePageProps> = () => {
  const [titleInput, setTitleInput] = useState<string>("");
  const [desInput, setDesInput] = useState<string>("");

  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleCreateCourse = async () => {
    if (titleInput.trim() === "") toast("Hãy nhập tên khóa học");
    else {
      let courseData = {
        author: user.name,
        author_id: user.uid,
        name: titleInput,
        description: desInput,
        created_at: Date.now(),
        followed_by: [],
      };

      dispatch(createCourse(courseData, user.uid));
      toast("Tạo khóa học thành công");

      setTitleInput("");
      setDesInput("");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton routerLink="/home" onClick={handleCreateCourse}>
              <IonIcon
                color="light"
                slot="icon-only"
                ios={checkmarkOutline}
                md={checkmarkSharp}
              />
            </IonButton>
          </IonButtons>
          <IonTitle>Tạo khóa học</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Tên khóa học</IonLabel>
            <IonInput
              value={titleInput}
              onIonChange={(e) => setTitleInput(e.detail.value!)}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Mô tả</IonLabel>
            <IonTextarea
              rows={3}
              value={desInput}
              onIonChange={(e) => setDesInput(e.detail.value!)}
            ></IonTextarea>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateCourse;
