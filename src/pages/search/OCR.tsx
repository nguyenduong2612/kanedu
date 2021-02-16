import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

interface PageProps {}

const { Camera } = Plugins;

const OCR: React.FC<PageProps> = () => {
  const [ocrWorker, setOcrWorker] = useState<any>();
  const [workerReady, setWorkerReady] = useState<boolean>(false);
  const [captureProgress, setCaptureProgress] = useState<number>(0.0);
  const [ocrResult, setOcrResult] = useState<string>("");

  const [ocrImage, setOcrImage] = useState<any>(
    "data:image/png;base64,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"
  );

  useEffect(() => {
    async function loadWorker() {
      const worker = createWorker({
        logger: (progress) => {
          console.log(progress);
          if (progress.status === "recognizing text") {
            setCaptureProgress(parseInt("" + progress.progress * 100));
          }
        },
      });

      await worker.load();
      await worker.loadLanguage("jpn");
      await worker.initialize("jpn");

      setWorkerReady(true);
      setOcrWorker(worker);
    }

    loadWorker();
  }, []);

  async function recognizeImage(worker: any, image: any) {
    const result = await worker.recognize(image);
    console.log(result);
    setOcrResult(result.data.text);
  }

  async function captureImage() {
    let image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      width: 960,
    });
    console.log("image: ", image);
    setOcrImage(image.dataUrl);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>OCR test</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonImg src={ocrImage} />
        <IonButton
          expand="full"
          disabled={!workerReady}
          onClick={captureImage}
        >
          Capture
        </IonButton>
        <IonButton
          expand="full"
          disabled={!workerReady}
          onClick={() => recognizeImage(ocrWorker, ocrImage)}
        >
          Recognize
        </IonButton>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Capture Progress: {captureProgress}%</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>{ocrResult}</IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default OCR;
