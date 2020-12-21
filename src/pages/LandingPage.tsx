import {
  IonContent,
  IonPage,
  IonList,
  IonSlides,
  IonSlide,
  IonButton,
} from "@ionic/react";
import React from "react";

interface ContainerProps {}

const slideOpts = {
  initialSlide: 0,
  speed: 400,
};

const LandingPage: React.FC<ContainerProps> = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonSlides style={{ height: "75%" }} pager={true} options={slideOpts}>
          <IonSlide>
            <h1>Slide 1</h1>
          </IonSlide>
          <IonSlide>
            <h1>Slide 2</h1>
          </IonSlide>
          <IonSlide>
            <h1>Slide 3</h1>
          </IonSlide>
        </IonSlides>

        <IonList style={{ width: "85%", margin: "5px auto 0" }}>
          <IonButton
            size="large"
            expand="block"
            mode="ios"
            routerLink="/register"
          >
            ĐĂNG KÝ MIỄN PHÍ
          </IonButton>
          <IonButton
            style={{ marginTop: 10 }}
            size="large"
            expand="block"
            mode="ios"
            fill="clear"
            routerLink="/login"
          >
            ĐĂNG NHẬP
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
