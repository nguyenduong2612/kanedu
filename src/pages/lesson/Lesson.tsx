import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonCardHeader,
  IonIcon,
  IonCardSubtitle,
} from "@ionic/react";
import {
  bookOutline,
  bookSharp,
  pencilOutline,
  pencilSharp,
} from "ionicons/icons";
import React, { useState, useEffect, lazy } from "react";
import { RouteComponentProps } from "react-router";
import { database } from "../../config/firebaseConfig";
import "./Lesson.scss";

const CardPreview = lazy(() => import("../../components/cards/CardPreview"));
interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const Lesson: React.FC<ContainerProps> = ({ match }) => {
  const [name, setName] = useState<string>("");
  const [numberOfCards, setNumberOfCards] = useState<number>();

  useEffect(() => {
    async function getInfo() {
      let ref = database
        .collection("courses")
        .doc(match.params.course_id)
        .collection("lessons")
        .doc(match.params.lesson_id);
      let doc: any = await ref.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setName(doc.data().title);
        database
          .collection("courses")
          .doc(match.params.course_id)
          .collection("lessons")
          .doc(match.params.lesson_id)
          .collection("cards")
          .get()
          .then((snap) => {
            setNumberOfCards(snap.size);
          });
      }
    }

    getInfo();
  }, [match]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              color="dark"
              defaultHref={`/courses/${match.params.course_id}`}
            />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="cards-preview">
          <CardPreview
            courseId={match.params.course_id}
            lessonId={match.params.lesson_id}
          />
        </div>
        <div className="main-menu">
          <IonGrid>
            <IonRow className="padding-x">
              <h1>{name}</h1>
            </IonRow>
            <IonRow className="padding-x">
              <p>umih4ra | {numberOfCards} thẻ</p>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonCard
                  className="menu-button"
                  button={true}
                  routerLink={`/courses/${match.params.course_id}/${match.params.lesson_id}/study`}
                >
                  <IonCardHeader className="menu-icon">
                    <IonIcon ios={bookOutline} md={bookSharp} />
                  </IonCardHeader>
                  <IonCardSubtitle className="menu-title">Học</IonCardSubtitle>
                </IonCard>
              </IonCol>
              <IonCol>
                <IonCard
                  className="menu-button"
                  button={true}
                  routerLink={`/courses/${match.params.course_id}/${match.params.lesson_id}/test`}
                >
                  <IonCardHeader className="menu-icon">
                    <IonIcon ios={pencilOutline} md={pencilSharp} />
                  </IonCardHeader>
                  <IonCardSubtitle className="menu-title">
                    Kiểm tra
                  </IonCardSubtitle>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Lesson;