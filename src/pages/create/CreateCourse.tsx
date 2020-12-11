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
} from "@ionic/react";
import { checkmarkOutline, checkmarkSharp } from "ionicons/icons";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { algoliaUpdateCourse } from "../../config/algoliaConfig";
import { database } from "../../config/firebaseConfig";
import { setMyCourses } from "../../redux/reducers/coursesReducer";
import { toast } from "../../utils/toast";

interface ContainerProps {}
interface RootState {
  user: any;
}

const CreateCourse: React.FC<ContainerProps> = () => {
  const [titleInput, setTitleInput] = useState<string>("");

  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleCreateCourse = async () => {
    if (titleInput.trim() === "") toast("Hãy nhập tên khóa học");
    else {
      let course = {
        author: currentUser.user.name,
        author_id: currentUser.user.uid,
        name: titleInput,
        created_at: Date.now(),
      };

      const res = await database.collection("courses").add(course);

      if (algoliaUpdateCourse(course, res.id)) console.log("add algolia ok")
      
      dispatch(setMyCourses({
        id: res.id,
        author: course.author,
        author_id: course.author_id,
        name: course.name,
        created_at: course.created_at,
      }));
      toast("Tạo khóa học thành công");

      setTitleInput("");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton routerLink="/home" onClick={handleCreateCourse}>
              <IonIcon
                color="dark"
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
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateCourse;
