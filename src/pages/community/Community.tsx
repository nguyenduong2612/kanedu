import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonItem,
  IonCol,
  IonRow,
  IonGrid,
  IonInput,
  IonLabel,
  IonPopover,
  IonTextarea,
  IonButton,
  IonLoading,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import PostList from "../../components/community/PostList";
import { database } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";

import "../../theme/app.css";
import "./Community.scss";

interface ContainerProps {}

const VerifyRequest: React.FC = () => {
  return (
    <div className="container">
      <strong>Vui lòng xác nhận email của bạn</strong>
    </div>
  );
};

const Community: React.FC<ContainerProps> = (props) => {
  const [busy, setBusy] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");

  const [user, setUser] = useState<any>(props);
  const [username, setUsername] = useState<string>("");
  const [profileURL, setProfileURL] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(user.emailVerified);

  useEffect(() => {
    async function getInfo() {
      setBusy(true);
      const ref = database
        .collection("users")
        .where("uid", "==", user.uid)
        .limit(1);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setUsername(doc.data().name);
          setProfileURL(doc.data().profileURL);
        });
      }

      setBusy(false);
    }

    getInfo();
  }, []);

  async function handleSendQuestion() {
    let post = {
      author: username,
      profileURL: profileURL,
      title: titleInput,
      content: contentInput,
      created_at: Date.now(),
    };

    await database.collection("posts").add(post);
    toast("Đăng thành công");
    setShowPopover(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="dark"
          ></IonMenuButton>
          <IonTitle>Cộng đồng</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait" duration={0} isOpen={busy} />

      {verified ? (
        <IonContent fullscreen>
          <IonGrid className="input-wrapper">
            <IonRow className="row">
              <IonCol size="2" className="col">
                <div className="image-wrapper">
                  <img id="community-avatar" src={profileURL} />
                </div>
              </IonCol>
              <IonCol size="10" className="col">
                <IonContent>
                  <IonPopover
                    isOpen={showPopover}
                    cssClass="input-modal"
                    onDidDismiss={(e) => setShowPopover(false)}
                  >
                    <IonItem>
                      <IonInput
                        value={titleInput}
                        placeholder="Tiêu đề"
                        onIonChange={(e) => setTitleInput(e.detail.value!)}
                      ></IonInput>
                    </IonItem>
                    <IonItem lines="none">
                      <IonTextarea
                        rows={6}
                        value={contentInput}
                        placeholder="Nội dung câu hỏi"
                        onIonChange={(e) => setContentInput(e.detail.value!)}
                      ></IonTextarea>
                    </IonItem>
                    <IonItem lines="none">
                      <IonButton
                        size="default"
                        style={{ width: "100%" }}
                        expand="block"
                        color="primary"
                        onClick={handleSendQuestion}
                      >
                        Đăng
                      </IonButton>
                    </IonItem>
                  </IonPopover>
                  <IonButton
                    expand="block"
                    fill="outline"
                    color="dark"
                    size="default"
                    onClick={() => setShowPopover(true)}
                  >
                    <p>Đặt câu hỏi</p>
                  </IonButton>
                </IonContent>
              </IonCol>
            </IonRow>
          </IonGrid>

          <PostList />
        </IonContent>
      ) : (
        <VerifyRequest />
      )}
    </IonPage>
  );
};

export default Community;
