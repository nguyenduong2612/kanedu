import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonCol,
  IonRow,
  IonGrid,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import React, { useEffect, useState, lazy } from "react";
import { useSelector } from "react-redux";
import { database } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";

import "../../theme/app.css";
import "./Community.scss";
import { algoliaUpdatePost } from "../../config/algoliaConfig";
import ErrorPage from "../../components/error_pages/ErrorPage";
import Refresher from "../../components/Refresher";
import SendQuestionPopup from "../../components/popups/SendQuestionPopup";

const PostContainer = lazy(
  () => import("../../components/containers/PostContainer")
);

interface ContainerProps {}
interface RootState {
  user: any;
}

const Community: React.FC<ContainerProps> = () => {
  const [showPopover, setShowPopover] = useState<boolean>(false);

  const [postList, setPostList] = useState<any[]>([]);
  const [loadedPostList, setLoadedPostList] = useState<boolean>();
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(
    false
  );
  const [currentPostList, setCurrentPostList] = useState<any[]>([]);

  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function getAllPost() {
      const ref = database.collection("posts");
      const docs = await ref.orderBy("created_at", "desc").get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setPostList((postList) => [
            ...postList,
            { data: doc.data(), id: doc.id },
          ]);
        });
        setLoadedPostList(true);
      }
    }

    getAllPost();
  }, []);

  useEffect(() => {
    function getCurrentPost() {
      if (!loadedPostList) return;
      for (let i = 0; i < 5; i++) {
        setCurrentPostList((currentPostList) => [
          ...currentPostList,
          postList[i],
        ]);
      }
    }
    getCurrentPost();
  }, [loadedPostList, postList]);

  const pushData = () => {
    const max = currentPostList.length + 3;
    const min = max - 3;
    for (let i = min; i < max; i++) {
      setCurrentPostList((currentPostList) => [
        ...currentPostList,
        postList[i],
      ]);
    }
  };

  const loadData = ($event: CustomEvent<void>) => {
    setTimeout(() => {
      pushData();
      ($event.target as HTMLIonInfiniteScrollElement).complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (currentPostList.length >= postList.length) {
        setDisableInfiniteScroll(true);
      }
    }, 750);
  };

  async function handleSendQuestion(title: string, content: string) {
    if (title.trim() === "" || content.trim() === "") {
      toast("Hãy nhập tiêu đề và nội dung câu hỏi");
    } else {
      let post = {
        author: currentUser.user.name,
        author_id: currentUser.user.uid,
        title: title,
        content: content,
        created_at: Date.now(),
      };

      const res = await database.collection("posts").add(post);

      if (algoliaUpdatePost(post, res.id)) console.log("add algolia ok");

      setCurrentPostList((currentPostList) => [
        { data: post, id: res.id },
        ...currentPostList,
      ]);
      toast("Đăng thành công");
      setShowPopover(false);
    }
  }

  var prevScrollpos = 0;
  const handleScroll = (event: any) => {
    var inputWrapper = document.getElementById("post-input-wrapper");

    if (!inputWrapper) return;

    var currentScrollPos = event.detail.scrollTop;
    if (prevScrollpos > currentScrollPos) {
      inputWrapper.style.top = "0";
    } else {
      inputWrapper.style.top = "-75px";
    }
    prevScrollpos = currentScrollPos;
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
          <IonTitle>Cộng đồng</IonTitle>
        </IonToolbar>
      </IonHeader>

      {currentUser.user.verified ? (
        <IonContent
          fullscreen
          scrollEvents={true}
          onIonScroll={(e: any) => handleScroll(e)}
        >
          <Refresher />
          <IonGrid id="post-input-wrapper">
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
                  <IonButton
                    expand="block"
                    fill="outline"
                    color="primary"
                    size="default"
                    onClick={() => setShowPopover(true)}
                  >
                    <p>Đặt câu hỏi</p>
                  </IonButton>

                  <SendQuestionPopup
                    isOpen={showPopover}
                    handleCloseModal={() => setShowPopover(false)}
                    handleSendQuestion={handleSendQuestion}
                  />
                </IonContent>
              </IonCol>
            </IonRow>
          </IonGrid>

          <div style={{ backgroundColor: "#ddd" }}>
            {currentPostList
              .filter((post) => post !== undefined)
              .map((post: any, index: number) => {
                return (
                  <PostContainer
                    key={index}
                    post={post}
                    username={currentUser.user.name}
                  />
                );
              })}

            <IonInfiniteScroll
              threshold="100px"
              disabled={disableInfiniteScroll}
              onIonInfinite={(e: CustomEvent<void>) => loadData(e)}
            >
              <IonInfiniteScrollContent loadingText="Đang tải thêm"></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </div>
        </IonContent>
      ) : (
        <ErrorPage>Vui lòng xác nhận email của bạn</ErrorPage>
      )}
    </IonPage>
  );
};

export default Community;
