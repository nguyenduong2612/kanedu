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
  speed: 400
};

const CardPreview: React.FC<ContainerProps> = ({
  courseId,
  lessonId,
}: ContainerProps) => {
  const [cardPreview, setCardPreview] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<boolean>(false);

  useEffect(() => {
    async function getAllLesson() {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .collection("cards")
        .limit(3)
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
  }, []);

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

                      </IonCardContent>
                    </IonCard>
                  </div>
                </div>
              </IonSlide>
            );
          })}
          <IonSlide>
            Bắt đầu bài học để xem thêm
          </IonSlide>
        </IonSlides>
      )}
    </>
  );
};

export default CardPreview;
