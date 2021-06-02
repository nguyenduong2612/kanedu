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
  IonSelectOption,
  IonSelect,
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
  const [level, setLevel] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleCreateCourse = async () => {
    if (titleInput.trim() === "" || desInput.trim() === "") {
      toast("Hãy nhập tên khóa học/mô tả khóa học");
      return;
    }

    if (level.trim() === "" || skill.trim() === "" || category.trim() === "") {
      toast("Hãy nhập đủ thông tin");
      return;
    }

    let courseData = {
      author: user.name,
      author_id: user.uid,
      name: titleInput,
      description: desInput,
      level,
      skill,
      category,
      created_at: Date.now(),
      followed_by: [],
    };

    dispatch(createCourse(courseData, user.uid));
    toast("Tạo khóa học thành công");

    setTitleInput("");
    setDesInput("");
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
      <IonContent fullscreen className="bg-white">
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

          <IonItem>
            <IonLabel>Cấp độ</IonLabel>
            <IonSelect
              value={level}
              interface="action-sheet"
              placeholder="Chọn cấp độ"
              onIonChange={(e: any) => setLevel(e.detail.value)}
              cancelText="Hủy"
            >
              <IonSelectOption value="N1">N1</IonSelectOption>
              <IonSelectOption value="N2">N2</IonSelectOption>
              <IonSelectOption value="N3">N3</IonSelectOption>
              <IonSelectOption value="N4">N4</IonSelectOption>
              <IonSelectOption value="N5">N5</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Kỹ năng</IonLabel>
            <IonSelect
              value={skill}
              interface="action-sheet"
              placeholder="Chọn kỹ năng"
              onIonChange={(e: any) => setSkill(e.detail.value)}
              cancelText="Hủy"
            >
              <IonSelectOption value="Từ vựng">Từ vựng</IonSelectOption>
              <IonSelectOption value="Hán tự">Hán tự</IonSelectOption>
              <IonSelectOption value="Ngữ pháp">Ngữ pháp</IonSelectOption>
              <IonSelectOption value="Khác">Khác</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Chủ đề</IonLabel>
            <IonSelect
              value={category}
              interface="action-sheet"
              placeholder="Chọn chủ đề"
              onIonChange={(e: any) => setCategory(e.detail.value)}
              cancelText="Hủy"
            >
              <IonSelectOption value="Luyện thi">Luyện thi</IonSelectOption>
              <IonSelectOption value="Tổng hợp">Tổng hợp</IonSelectOption>
              <IonSelectOption value="Kỹ thuật">Kỹ thuật</IonSelectOption>
              <IonSelectOption value="Kinh tế">Kinh tế</IonSelectOption>
              <IonSelectOption value="Kinh doanh">Kinh doanh</IonSelectOption>
              <IonSelectOption value="Khác">Khác</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateCourse;
