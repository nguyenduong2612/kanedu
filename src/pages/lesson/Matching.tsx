import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonAlert,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { database } from "../../config/firebaseConfig";
import useTabbar from "../../hooks/useTabbar";
import "./Matching.scss";

interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface MatchingPageProps extends RouteComponentProps<MatchParams> {}

const Matching: React.FC<MatchingPageProps> = ({ match }) => {
  useTabbar();

  const courseId = match.params.course_id;
  const lessonId = match.params.lesson_id;
  let clickedCards: Array<any> = [];
  const [cards, setCards] = useState<any[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const allDocs: any[] = [];
      const allCards: object[] = [];

      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .collection("cards");
      const snap = await ref.get();
      snap.forEach((doc: any) => {
        allDocs.push({ id: doc.id, data: doc.data() });
      });
      allDocs.sort(() => Math.random() - 0.5); // Shuffle

      let count: number = 0;
      allDocs.forEach((doc: any) => {
        if (count === 12) return;
        let newKeyword = {
          elemId: `keyword-${doc.id}`,
          cardId: doc.id,
          text: doc.data.keyword,
          type: "keyword",
        };
        let newMeaning = {
          elemId: `meaning-${doc.id}`,
          cardId: doc.id,
          detail: doc.data.detail,
          meaning: doc.data.meaning,
          type: "meaning",
        };

        allCards.push(newKeyword);
        allCards.push(newMeaning);
        count += 2;
      });

      allCards.sort(() => Math.random() - 0.5); // Shuffle
      setCards(allCards);
    };

    init();
  }, [courseId, lessonId]);

  useEffect(() => {
    if (correctCount === 6) {
      setShowAlert(true);
    }
  }, [correctCount]);

  const onClickCard = (elemId: string, cardId: string) => {
    clickedCards.push({ elemId, cardId });
    if (clickedCards.length === 2) {
      if (clickedCards[0].cardId === clickedCards[1].cardId) {
        matched();
      } else {
        unmatched();
      }
    } else {
      clicked(elemId);
    }
  };

  const clicked = (elemId: string) => {
    let clickedCard = document.getElementById(elemId);

    clickedCard?.classList.add("ion-color");
    clickedCard?.classList.add("ion-color-warning");
  };

  const matched = () => {
    console.log("Matched");
    setCorrectCount(correctCount + 1);

    for (let i = 0; i < clickedCards.length; i++) {
      let matchedCard = document.getElementById(clickedCards[i].elemId);

      matchedCard?.classList.add("ion-color");
      matchedCard?.classList.remove("ion-color-warning");
      matchedCard?.classList.add("ion-color-success");
      // let answerBtns = document.getElementsByClassName(
      //   `ion-color-success`
      // );
      // Array.prototype.forEach.call(answerBtns, function (answerBtn) {
      //   answerBtn?.classList.add("disabled");
      // });
    }

    clickedCards = [];
  };

  const unmatched = () => {
    console.log("Unmatched");

    let temp = [...clickedCards];
    for (let i = 0; i < clickedCards.length; i++) {
      let unmatchedCard = document.getElementById(clickedCards[i].elemId);

      unmatchedCard?.classList.add("ion-color");
      unmatchedCard?.classList.remove("ion-color-warning");
      unmatchedCard?.classList.add("ion-color-danger");
    }

    setTimeout(function () {
      for (let i = 0; i < temp.length; i++) {
        let unmatchedCard = document.getElementById(temp[i].elemId);

        unmatchedCard?.classList.remove("ion-color");
        unmatchedCard?.classList.remove("ion-color-danger");
      }
    }, 1100);

    clickedCards = [];
  };

  return (
    <IonPage className="pd-0">
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Ghép thẻ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonAlert
          isOpen={showAlert}
          cssClass="alert"
          onDidDismiss={() => setShowAlert(false)}
          header={"Thông báo"}
          message={`Hoàn thành bài kiểm tra`}
          buttons={["Xác nhận"]}
        />

        <IonGrid>
          <IonRow className="card-row">
            {cards.map((item: any, index: number) => {
              return (
                <IonCol key={index} size="4">
                  <IonButton
                    expand="block"
                    mode="md"
                    fill="outline"
                    id={item.elemId}
                    onClick={() => onClickCard(item.elemId, item.cardId)}
                    className="card-wrapper"
                  >
                    {item.type === "keyword" ? (
                      <div className="card-wrapper__text">
                        <p>{item.text}</p>
                      </div>
                    ) : (
                      <div className="card-wrapper__text">
                        <p>{item.detail}</p>
                        <p>{item.meaning}</p>
                      </div>
                    )}
                  </IonButton>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Matching;
