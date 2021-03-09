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
  IonSpinner,
} from "@ionic/react";
import React, { useState } from "react";
import { functions, storage } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";

interface PageProps {}

const { Camera } = Plugins;

const OCR: React.FC<PageProps> = () => {
  const [ocrResult, setOcrResult] = useState<string>("");

  const [image, setImage] = useState<any>(
    "https://www.textures.com/system/gallery/photos/Signs/Asian%20Signs/Japanese/75622/SignsJapan0018_download600.jpg"
  );
  const [loading, setLoading] = useState<boolean>(false);

  async function recognizeImage() {
    setLoading(true);
    var detectText = functions.httpsCallable("detectText");
    detectText({ image })
      .then((result) => {
        console.log(result);
        setOcrResult(result.data[0].description);
        setLoading(false);
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
        <IonImg src={image} />
        <IonButton expand="full" onClick={captureImage} disabled={loading}>
          Capture
        </IonButton>
        <IonButton
          expand="full"
          onClick={() => recognizeImage()}
          disabled={loading}
        >
          Recognize
        </IonButton>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Result: </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {loading ? <IonSpinner color="primary" /> : ocrResult}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default OCR;
