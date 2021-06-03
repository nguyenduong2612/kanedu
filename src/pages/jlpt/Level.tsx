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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonCardContent,
  IonCol,
  IonRow,
  IonIcon,
} from "@ionic/react";
import { alarm, cube } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import ErrorPage from "../../components/error_pages/ErrorPage";
import Spinner from "../../components/utils/Spinner";
import { database } from "../../config/firebaseConfig";
import "./Level.scss";

interface LevelPageProps {}

const Level: React.FC<LevelPageProps> = () => {
  const [level, setLevel] = useState<string>("5");
  const [exams, setExams] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const getExamList = async () => {
      const ref = database.collection("tests").where("level", "==", level);
      const docs = await ref.get();
      if (!docs.empty) {
        docs.forEach((doc) => {
          let exam = {
            id: doc.id,
            ...doc.data(),
          };
          setExams((exams) => [...exams, exam]);
        });
      }

      setIsLoaded(true);
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
        <IonToolbar mode="md">
          <IonSegment
            mode="md"
            scrollable
            value={level}
            color="light"
            className="search-segment"
            onIonChange={(e) => handleChangeLevel(e)}
          >
            <IonSegmentButton value="5">
              <IonLabel>N5</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="4">
              <IonLabel>N4</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="3">
              <IonLabel>N3</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="2">
              <IonLabel>N2</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="1">
              <IonLabel>N1</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="max-width-700">
          {isLoaded ? (
            exams.length > 0 ? (
              exams.map((exam: any, i: number) => {
                return (
                  <IonCard
                    key={i}
                    mode="ios"
                    className="exam-wrapper"
                    routerLink={`/jlpt/${exam.id}`}
                  >
                    <IonGrid>
                      <IonCardHeader>
                        <IonCardTitle>
                          <span className="exam__title">{exam.title}</span>
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent className="exam__detail">
                        <IonRow>
                          <IonCol size="6">
                            <IonIcon icon={cube}></IonIcon>Số lượng câu hỏi:{" "}
                            {exam.answer_sheet.length}
                          </IonCol>
                          <IonCol size="6">
                            <IonIcon icon={alarm}></IonIcon>Thời lượng:{" "}
                            {exam.time} phút
                          </IonCol>
                        </IonRow>
                      </IonCardContent>
                    </IonGrid>
                  </IonCard>
                );
              })
            ) : (
              <ErrorPage>Không có dữ liệu</ErrorPage>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Level;
