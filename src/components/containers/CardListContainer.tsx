import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import { alertCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import React, { useState } from "react";
import useCards from "../../hooks/card/useCards";
import Spinner from "../utils/Spinner";
import "./CardListContainer.scss";

const slideOpts = {
  initialSlide: 1,
  speed: 400,
  loop: true,
};

interface CardSlideProps {
  card: any;
  key: number;
}

const CardSlide: React.FC<CardSlideProps> = ({
  card,
}: CardSlideProps) => {
  const flipped: boolean = false;
  const [status, setStatus] = useState<string>();

  return (
    <IonSlide>
      <div className={flipped ? "flip-container flipped" : "flip-container"}>
        <div className="flipper">
          <IonCard mode="ios" className="front card">
            <IonCardHeader className="keyword-wrapper">
              <IonCardTitle className="keyword">{card.keyword}</IonCardTitle>
            </IonCardHeader>
          </IonCard>

          <IonCard mode="ios" className="back card">
            <IonCardHeader className="back-wrapper">
              <IonCardTitle className="keyword">{card.keyword}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <p className="detail">{card.detail}</p>
                </IonRow>
                <IonRow>
                  <p className="meaning">{card.meaning}</p>
                </IonRow>
              </IonGrid>

              {card.examples &&
                card.examples.map((example: any, index: number) => {
                  return (
                    <IonItem lines="none" key={index}>
                      {example.word} ({example.detail}): {example.mean}
                    </IonItem>
                  );
                })}
            </IonCardContent>
          </IonCard>
        </div>
      </div>

      <IonRow className="learning-page__button-row">
        <IonCol size="6">
          <IonButton
            className="learning-page__button"
            fill={status === "forget" ? "solid" : "outline"}
            color="warning"
            onClick={() => setStatus("forget")}
          >
            <div className="learning-page__button-text">
              <IonIcon icon={alertCircleOutline}></IonIcon>
              <p>Chưa thuộc</p>
            </div>
          </IonButton>
        </IonCol>
        <IonCol size="6">
          <IonButton
            className="learning-page__button"
            fill={status === "remembered" ? "solid" : "outline"}
            color="success"
            onClick={() => setStatus("remembered")}
          >
            <div className="learning-page__button-text">
              <IonIcon icon={checkmarkCircleOutline}></IonIcon>
              <p>Đã thuộc</p>
            </div>
          </IonButton>
        </IonCol>
      </IonRow>
    </IonSlide>
  );
};

interface CardListContainerProps {
  courseId: string;
  lessonId: string;
}

const CardListContainer: React.FC<CardListContainerProps> = ({
  courseId,
  lessonId,
}: CardListContainerProps) => {
  const { cardList, isLoaded } = useCards(courseId, lessonId);

  return (
    <>
      {isLoaded ? (
        cardList.length > 0 && (
          <IonSlides options={slideOpts} className="card-list__slides">
            {cardList.map((card: any, index: number) => {
              return <CardSlide card={card} key={index} />;
            })}
          </IonSlides>
        )
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default CardListContainer;
