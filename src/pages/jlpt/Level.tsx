import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonItem,
  IonList,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import ErrorPage from "../../components/error_pages/ErrorPage";
import { database } from "../../config/firebaseConfig";

interface ContainerProps {}

const Level: React.FC<ContainerProps> = () => {
  const [level, setLevel] = useState<string>("N5");
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    const getExamList = async () => {
      const ref = database.collection("tests").where("level", "==", level);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let exam = {
            title: doc.data().title,
            id: doc.id,
          };
          setExams((exams) => [...exams, exam]);
        });
      }
    };

    getExamList();
  }, [level]);

  const handleChangeLevel = (e: any) => {
    setExams([]);
    setLevel(e.detail.value!);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonMenuButton
              slot="start"
              className="menu-btn"
              color="light"
            ></IonMenuButton>
          </IonButtons>
          <IonTitle>Thi thử</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSegment
          scrollable
          value={level}
          color="primary"
          onIonChange={(e) => handleChangeLevel(e)}
        >
          <IonSegmentButton value="N5">
            <IonLabel>N5</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="N4">
            <IonLabel>N4</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="N3">
            <IonLabel>N3</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="N2">
            <IonLabel>N2</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="N1">
            <IonLabel>N1</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {exams.length > 0 ? (
          exams.map((exam: any, i: number) => {
            return (
              <IonList key={i}>
                <IonItem button routerLink={`/jlpt/${exam.id}`}>
                  <IonTitle>{exam.title}</IonTitle>
                </IonItem>
              </IonList>
            );
          })
        ) : (
          <ErrorPage>Không có dữ liệu</ErrorPage>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Level;
