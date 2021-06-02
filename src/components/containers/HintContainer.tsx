import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import { bulb } from "ionicons/icons";
import React from "react";
import "./HintContainer.scss";

interface HintContainerProps {}

const slideOpts = {
  initialSlide: 0,
  speed: 400,
  loop: true,
};

const HintContainer: React.FC<HintContainerProps> = () => {
  return (
    <div className="hint-container">
      <IonSlides pager={true} options={slideOpts} style={{ height: "100%" }}>
        <IonSlide>
          <IonCard className="hint-wrapper">
            <IonCardHeader mode="md" className="hint-header">
              <IonCardTitle className="hint-title">
                <IonIcon
                  icon={bulb}
                  style={{ paddingRight: 7, paddingTop: 1 }}
                ></IonIcon>
                Mẹo
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent className="hint-content">
              <img src="../assets/images/hint1.png" alt="hint1" />
              <div className="hint-text">
                Tìm kiếm bài học, câu hỏi, bạn bè.<br></br>Bất cứ thứ gì.<br></br>
                <IonButton
                  fill="outline"
                  className="hint-button"
                  routerLink="/search"
                >
                  Tìm kiếm
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </IonSlide>

        <IonSlide>
          <IonCard className="hint-wrapper">
            <IonCardHeader mode="md" className="hint-header">
              <IonCardTitle className="hint-title">
                <IonIcon
                  icon={bulb}
                  style={{ paddingRight: 7, paddingTop: 1 }}
                ></IonIcon>
                Mẹo
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent className="hint-content">
              <img src="../assets/images/hint2.png" alt="hint2" />
              <div className="hint-text">
                Tạo khóa học cho riêng mình.<br></br>
                Chia sẻ chúng với bạn bè.<br></br>
                <IonButton
                  fill="outline"
                  className="hint-button"
                  routerLink="/course/create"
                >
                  Tạo khóa học
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </IonSlide>
      </IonSlides>
    </div>
  );
};

export default HintContainer;
