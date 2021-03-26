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
  IonCard,
  IonCardContent,
  IonSpinner,
  IonCardSubtitle,
  IonCol,
  IonRow,
} from "@ionic/react";
import React, { useState } from "react";
import { functions, storage } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";
import "./OCR.scss";

interface OcrPageProps {}

const { Camera } = Plugins;

const OCR: React.FC<OcrPageProps> = () => {
  const [result, setResult] = useState<any>({ text: "", translation: "" });

  const [image, setImage] = useState<any>(
    "https://www.textures.com/system/gallery/photos/Signs/Asian%20Signs/Japanese/75622/SignsJapan0018_download600.jpg"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  async function recognizeImage() {
    setLoading(true);
    var detectText = functions.httpsCallable("detectText");
    detectText({ image })
      .then((result) => {
        console.log(result);
        setResult(result.data);
        setLoading(false);
        setLoaded(true);
      })
      .catch((error) => {
        var code = error.code;
        var message = error.message;
        var details = error.details;
        console.log(code, message, details);
        toast("Có lỗi xảy ra. Vui lòng thử lại");
        setLoading(false);
      });
  }

  async function uploadImage(newImage: any) {
    const storageRef = storage.ref();

    const fileName = String(Date.now());
    const fileRef = storageRef.child(`photos/${fileName}.${newImage.format}`);
    try {
      let fileData = newImage.dataUrl.split(",")[1];
      await fileRef.putString(fileData, "base64");
      let imageURL = await fileRef.getDownloadURL();
      setImage(imageURL);
      toast("Tải ảnh thành công");
    } catch (err) {
      console.error(err);
      toast("Tải ảnh không thành công. Vui lòng thử lại");
    }
  }

  async function captureImage() {
    let newImage = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      width: 480,
    });
    uploadImage(newImage);
  }

  return (
    <IonPage className="ocr-page">
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>Dịch bằng máy ảnh</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard mode="ios">
          <IonImg src={image} />
          {loaded ? (
            <>
              <IonCardHeader>
                <IonCardSubtitle style={{ fontSize: 14 }}>Kết quả</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{result.text}</p>
                <p>{result.translation}</p>
              </IonCardContent>
            </>
          ) : (
            loading && (
              <IonCardContent>
                <IonSpinner color="primary" />
              </IonCardContent>
            )
          )}
        </IonCard>

        <IonRow className="ocr-row">
          <IonCol size="6">
            <IonButton className="ocr-button" onClick={captureImage} disabled={loading}>
              Chụp hình
            </IonButton>
          </IonCol>
          <IonCol size="6">
            <IonButton
              className="ocr-button"
              onClick={() => recognizeImage()}
              disabled={loading}
            >
              Nhận dạng
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default OCR;
