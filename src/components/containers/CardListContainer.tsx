import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonItem,
  IonRow,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import React from "react";
import useCards from "../../hooks/card/useCards";
import "./CardListContainer.scss";

interface CardListContainerProps {
  courseId: string;
  lessonId: string;
}

const slideOpts = {
  initialSlide: 1,
  speed: 400,
  loop: true,
};

const CardListContainer: React.FC<CardListContainerProps> = ({
  courseId,
  lessonId,
}: CardListContainerProps) => {
  const flipped: boolean = false;

  const cardList = useCards(courseId, lessonId).cardList;

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
                    <IonCard mode="ios" className="front card">
                      <IonCardHeader className="keyword-wrapper">
                        <IonCardTitle className="keyword">
                          {card.data().keyword}
                        </IonCardTitle>
                      </IonCardHeader>
                    </IonCard>

                    <IonCard mode="ios" className="back card">
                      <IonCardHeader className="back-wrapper">
                        <IonCardTitle className="keyword">
                          {card.data().keyword}
                        </IonCardTitle>
                      </IonCardHeader>

                      <IonCardContent>
                        <IonGrid>
                          <IonRow>
                            <p className="detail">{card.data().detail}</p>
                          </IonRow>
                          <IonRow>
                            <p className="meaning">{card.data().meaning}</p>
                          </IonRow>
                        </IonGrid>

                        {card.data().examples &&
                          card
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

export default CardListContainer;
