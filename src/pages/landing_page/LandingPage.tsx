import {
  IonContent,
  IonPage,
  IonList,
  IonSlides,
  IonSlide,
  IonButton,
} from "@ionic/react";
import React from "react";
import useTabbar from "../../hooks/useTabbar";
import "./LandingPage.scss";

const slideOpts = {
  initialSlide: 0,
  speed: 400,
  loop: true,
  autoplay: {
    delay: 5000,
  },
};

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  useTabbar();

  return (
    <>
      <div className="landing-page__background"></div>
      <IonPage style={{ paddingBottom: 0 }}>
        <IonContent fullscreen>
          <div className="logo-wrapper">
            <h1 className="logo">Kanedu</h1>
          </div>

          <div className="landing-page">
            <IonSlides className="lp-slides" pager={true} options={slideOpts}>
              <IonSlide>
                <div className="slide-wrapper">
                  <img src="../assets/images/slide5.png" alt="slide1" />
                  <h4 className="lp-title">
                    Ứng dụng học tiếng Nhật của riêng bạn
                  </h4>
                </div>
              </IonSlide>
              <IonSlide>
                <div className="slide-wrapper">
                  <img src="../assets/images/slide2.png" alt="slide2" />
                  <h4 className="lp-title">
                    Học mọi lúc, mọi nơi, trên mọi thiết bị
                  </h4>
                </div>
              </IonSlide>
              <IonSlide>
                <div className="slide-wrapper">
                  <img src="../assets/images/slide4.png" alt="slide3" />
                  <h4 className="lp-title">Kết nối cộng đồng học tiếng Nhật</h4>
                </div>
              </IonSlide>
              <IonSlide>
                <div className="slide-wrapper">
                  <img src="../assets/images/slide1.png" alt="slide4" />
                  <h4 className="lp-title">Tự rèn luyện khả năng ngôn ngữ</h4>
                </div>
              </IonSlide>
            </IonSlides>

            <IonList className="lp-btn">
              <IonButton
                size="default"
                expand="block"
                mode="ios"
                routerLink="/register"
              >
                ĐĂNG KÝ MIỄN PHÍ
              </IonButton>
              <IonButton
                style={{ marginTop: 5 }}
                size="default"
                expand="block"
                mode="ios"
                fill="clear"
                routerLink="/login"
              >
                ĐĂNG NHẬP
              </IonButton>
              <IonButton
                size="small"
                expand="block"
                mode="ios"
                fill="clear"
                routerLink="/home"
              >
                <span style={{ fontSize: "13px" }}>Không phải bây giờ</span>
              </IonButton>
            </IonList>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default LandingPage;
