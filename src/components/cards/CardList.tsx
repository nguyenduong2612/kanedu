import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";
import "./CardList.scss";

interface ContainerProps {
  courseId: string;
  lessonId: string;
}

const slideOpts = {
  initialSlide: 1,
  speed: 400,
  loop: true,
};

const CardList: React.FC<ContainerProps> = ({
  courseId,
  lessonId,
}: ContainerProps) => {
  const [cardList, setCardList] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<boolean>(false);

  useEffect(() => {
    async function getAllLesson() {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .collection("cards");
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setCardList((cardList) => [...cardList, doc]);
        });
      }
    }

    getAllLesson();
  }, []);

  return (
    <>
      {cardList.length > 0 && (
        <IonSlides options={slideOpts} style={{ height: "100%" }}>
          {cardList.map((card: any, index: number) => {
            return (
              <IonSlide key={index}>
                <div
                  className={
                    flipped ? "flip-container flipped" : "flip-container"
                  }
                >
                  <div className="flipper">
                    <IonCard className="front card">
                      <IonCardHeader className="keyword-wrapper">
                        <IonCardTitle className="keyword">
                          {card.data().keyword}
                        </IonCardTitle>
                      </IonCardHeader>
                    </IonCard>

                    <IonCard className="back card">
                      <IonCardHeader className="back-wrapper">
                        <IonCardTitle>{card.data().keyword}</IonCardTitle>
                      </IonCardHeader>

                      <IonCardContent>
                        <IonItem
                          lines="none"
                          style={{ paddingBottom: 20, fontSize: 18 }}
                        >
                          {card.data().detail}
                        </IonItem>

                        {card
                          .data()
                          .examples.map((example: any, index: number) => {
                            return (
                              <IonItem lines="none" key={index}>
                                {example.word} ({example.detail}):{" "}
                                {example.mean}
                              </IonItem>
                            );
                          })}
                      </IonCardContent>
                    </IonCard>
                  </div>
                </div>
              </IonSlide>
            );
          })}
        </IonSlides>
      )}
    </>
  );
};

export default CardList;
