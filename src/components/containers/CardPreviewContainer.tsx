import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import React from "react";
import useCards from "../../hooks/card/useCards";
import Spinner from "../utils/Spinner";
import "./CardListContainer.scss";

interface CardPreviewContainerProps {
  courseId: string;
  lessonId: string;
}

const slideOpts = {
  initialSlide: 0,
  speed: 400,
};

const CardPreviewContainer: React.FC<CardPreviewContainerProps> = ({
  courseId,
  lessonId,
}: CardPreviewContainerProps) => {
  const flipped: boolean = false;

  const { cardPreview, isLoaded } = useCards(courseId, lessonId);

  return (
    <>
      {isLoaded ? (
        cardPreview.length > 0 && (
          <IonSlides options={slideOpts} className="card-preview__slides max-width-700">
            {cardPreview.map((card: any, index: number) => {
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
                          <IonCardTitle className="preview-keyword">
                            {card.keyword}
                          </IonCardTitle>
                        </IonCardHeader>
                      </IonCard>

                      <IonCard mode="ios" className="back card">
                        <IonCardHeader className="back-wrapper">
                          <IonCardTitle className="preview-keyword">
                            {card.keyword}
                          </IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>
                          <IonGrid>
                            <IonRow>
                              <p className="preview-detail">
                                {card.detail}
                              </p>
                            </IonRow>
                            <IonRow>
                              <p className="preview-meaning">
                                {card.meaning}
                              </p>
                            </IonRow>
                          </IonGrid>
                        </IonCardContent>
                      </IonCard>
                    </div>
                  </div>
                </IonSlide>
              );
            })}
            <IonSlide>Bắt đầu bài học để xem thêm</IonSlide>
          </IonSlides>
        )
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default CardPreviewContainer;
