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
import { useSelector } from 'react-redux'
import { database } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";

import "../../theme/app.css";
import "./Community.scss";

const Post = lazy(() => import("../../components/community/Post"));

interface ContainerProps {}
interface RootState {
  user: any
}

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

const Community: React.FC<ContainerProps> = () => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");

  const [postList, setPostList] = useState<any[]>([]);

  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
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

    getAllPost();
  }, []);

  async function handleSendQuestion() {
    let post = {
      author: currentUser.user.name,
      profileURL: currentUser.user.profileURL,
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

      {currentUser.user.verified ? (
        <IonContent fullscreen>
          <IonGrid className="input-wrapper">
            <IonRow className="row">
              <IonCol size="2" className="col">
                <div className="image-wrapper">
                  <img
                    alt="user-avatar"
                    id="community-avatar"
                    src={currentUser.user.profileURL}
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

          <PostList postList={postList} username={currentUser.user.name} />
        </IonContent>
      ) : (
        <VerifyRequest />
      )}
    </IonPage>
  );
};

export default Community;
