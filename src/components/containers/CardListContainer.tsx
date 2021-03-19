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
import { useDispatch, useSelector } from "react-redux";
import { updateCardStatus } from "../../redux/user/user.actions";

const slideOpts = {
  initialSlide: 1,
  speed: 400,
  loop: true,
};

interface CardSlideProps {
  card: any;
  key: number;
  lessonId: string;
}

interface RootState {
  user: any;
}

const CardSlide: React.FC<CardSlideProps> = ({
  card,
  lessonId,
}: CardSlideProps) => {
  const flipped: boolean = false;
  const [status, setStatus] = useState<string>(card.status);

  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch()

  const onClickForget = async (cardId: string, lessonId: string) => {
    if (status === "forget") return;
    setStatus("forget");
    dispatch(updateCardStatus(user, cardId, lessonId, "forget"));
  };

  const onClickRemembered = async (cardId: string, lessonId: string) => {
    if (status === "remembered") return;
    setStatus("remembered");
    dispatch(updateCardStatus(user, cardId, lessonId, "remembered"));
  };

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
            onClick={() => onClickForget(card.id, lessonId)}
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
            onClick={() => onClickRemembered(card.id, lessonId)}
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
          <IonSlides options={slideOpts} className="card-list__slides max-width-700">
            {cardList.map((card: any, index: number) => {
              return (
                <CardSlide card={card} key={index} lessonId={lessonId} />
              );
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
