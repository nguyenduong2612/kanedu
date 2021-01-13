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
import React, { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";
import "./CardListContainer.scss";

interface ContainerProps {
  courseId: string;
  lessonId: string;
}

const slideOpts = {
  initialSlide: 0,
  speed: 400,
};

const CardPreviewContainer: React.FC<ContainerProps> = ({
  courseId,
  lessonId,
}: ContainerProps) => {
  const [cardPreview, setCardPreview] = useState<any[]>([]);
  const flipped: boolean = false;

  useEffect(() => {
    async function getAllLesson() {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .collection("cards")
        .limit(3);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setCardPreview((cardPreview) => [...cardPreview, doc]);
        });
      }
    }

    getAllLesson();
  }, [courseId, lessonId]);

  return (
    <>
      {cardPreview.length > 0 && (
        <IonSlides options={slideOpts} style={{ height: "100%" }}>
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
                          {card.data().keyword}
                        </IonCardTitle>
                      </IonCardHeader>
                    </IonCard>

                    <IonCard mode="ios" className="back card">
                      <IonCardHeader className="back-wrapper">
                        <IonCardTitle className="preview-keyword">{card.data().keyword}</IonCardTitle>
                      </IonCardHeader>

                      <IonCardContent>
                        <IonGrid>
                          <IonRow>
                            <p className="preview-detail">
                              {card.data().detail}
                            </p>
                          </IonRow>
                          <IonRow>
                            <p className="preview-meaning">
                              {card.data().meaning}
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
      )}
    </>
  );
};

export default CardPreviewContainer;
