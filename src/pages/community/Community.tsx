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
  IonPopover,
  IonTextarea,
  IonButton,
} from "@ionic/react";
import React, { useEffect, useState, lazy } from "react";
import { database } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";

import "../../theme/app.css";
import "./Community.scss";

const Post = lazy(() => import("../../components/community/Post"));

interface ContainerProps {}

interface PostListProps {
  postList: any[];
  username: string;
}

const VerifyRequest: React.FC = () => {
  return (
    <div className="container">
      <strong>Vui lòng xác nhận email của bạn</strong>
    </div>
  );
};

const PostList: React.FC<PostListProps> = ({ postList, username }) => {
  return (
    <div style={{ paddingTop: 10 }}>
      {postList.map((post: any, index: number) => {
        return <Post key={index} post={post} username={username} />;
      })}
    </div>
  );
};

const Community: React.FC<ContainerProps> = (props) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");

  const [username, setUsername] = useState<string>("");
  const [profileURL, setProfileURL] = useState<string>("");
  const [postList, setPostList] = useState<any[]>([]);

  const user: any = props;
  const verified: boolean = user.emailVerified;

  useEffect(() => {
    async function getInfo() {
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
    }

    async function getAllPost() {
      const ref = database.collection("posts");
      const docs = await ref.orderBy("created_at", "desc").get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setPostList((postList) => [...postList, {data: doc.data(), id: doc.id}]);
        });
      }
    }

    getInfo();
    getAllPost();
  }, [user.uid]);

  async function handleSendQuestion() {
    let post = {
      author: username,
      profileURL: profileURL,
      title: titleInput,
      content: contentInput,
      created_at: Date.now(),
    };

    const res = await database.collection("posts").add(post);
    
    setPostList((postList) => [{data: post, id: res.id}, ...postList]);
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

      {verified ? (
        <IonContent fullscreen>
          <IonGrid className="input-wrapper">
            <IonRow className="row">
              <IonCol size="2" className="col">
                <div className="image-wrapper">
                  <img
                    alt="user-avatar"
                    id="community-avatar"
                    src={profileURL}
                  />
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

          <PostList postList={postList} username={username} />
        </IonContent>
      ) : (
        <VerifyRequest />
      )}
    </IonPage>
  );
};

export default Community;
