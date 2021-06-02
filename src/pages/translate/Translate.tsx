import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButtons,
  IonList,
  IonItemDivider,
  IonMenuButton,
  IonTextarea,
  IonCol,
  IonRow,
  IonIcon,
  IonButton,
  IonGrid,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import { camera, copyOutline, repeat, volumeHighOutline } from "ionicons/icons";
import React, { useState } from "react";
import { Plugins } from "@capacitor/core";
import "./Translate.scss";
import { functions } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";
import Spinner from "../../components/utils/Spinner";

const { Accessibility, Clipboard } = Plugins;

interface TranslatePageProps {}

const Settings: React.FC<TranslatePageProps> = () => {
  const [text, setText] = useState<string>("");
  const [target, setTarget] = useState<string>("vi");
  const [translation, setTranslation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const speak = () => {
    if (target === "vi") return;
    Accessibility.speak({ language: target, value: translation });
  };

  const copyToClipboard = () => {
    Clipboard.write({
      string: translation,
    });
    toast("Đã sao chép vào clipboard");
  };

  const translate = async () => {
    setIsLoading(true);
    var translateText = functions.httpsCallable("translateText");
    translateText({ text, target })
      .then((result) => {
        console.log(result);
        setTranslation(result.data.translation);
        setIsLoaded(true);
        setIsLoading(false);
      })
      .catch((error) => {
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.log(code, message, details);
        toast("Có lỗi xảy ra. Vui lòng thử lại");
        setIsLoading(false);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="light"
          ></IonMenuButton>
          <IonTitle>Dịch</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/ocr">
              <IonIcon color="light" slot="icon-only" icon={camera} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="bg-white">
        <IonList className="max-width-700">
          <IonItem lines="none" className="language-bar">
            <IonGrid>
              <IonRow>
                <IonCol size="5">
                  <span>{target === "vi" ? "Japanese" : "Vietnamese"}</span>
                </IonCol>
                <IonCol size="2">
                  <IonButton
                    fill="clear"
                    color="dark"
                    onClick={() => setTarget(target === "vi" ? "ja" : "vi")}
                  >
                    <IonIcon slot="icon-only" icon={repeat} />
                  </IonButton>
                </IonCol>
                <IonCol size="5">
                  <span>{target === "vi" ? "Vietnamese" : "Japanese"}</span>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>

          <IonItemDivider />
          <IonItem lines="none">
            <IonTextarea
              placeholder="Nhập văn bản"
              value={text}
              onIonChange={(e) => setText(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonButtons slot="end">
              <IonButton
                className="translate-btn"
                fill="solid"
                color="primary"
                onClick={translate}
              >
                Dịch
              </IonButton>
            </IonButtons>
          </IonItem>

          {isLoading ? (
            <div style={{ height: "30vh" }}>
              <Spinner />
            </div>
          ) : (
            isLoaded && (
              <IonCard mode="md" className="translation-wrapper">
                <div className="button-wrapper">
                  <IonButton
                    className="translation-wrapper__btn"
                    fill="clear"
                    color="dark"
                    onClick={speak}
                  >
                    <IonIcon slot="icon-only" icon={volumeHighOutline} />
                  </IonButton>
                  <IonButton
                    className="translation-wrapper__btn"
                    fill="clear"
                    color="dark"
                    onClick={copyToClipboard}
                  >
                    <IonIcon slot="icon-only" icon={copyOutline} />
                  </IonButton>
                </div>

                <IonCardContent className="translation-text">
                  {translation}
                </IonCardContent>
              </IonCard>
            )
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
