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

interface CommunityPageProps {}
interface RootState {
  user: any;
  posts: any;
}

const Community: React.FC<CommunityPageProps> = () => {
  const [showPopover, setShowPopover] = useState<boolean>(false);

  const [postList, setPostList] = useState<any[]>([]);

  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function loadPost() {
      const ref = database.collection("posts");
      const docs = await ref.orderBy("created_at", "desc").limit(5).get();

      if (docs.empty) {
        console.log("No such document!");
        return;
      } else {
        docs.forEach((doc) => {
          setPostList((postList) => [
            ...postList,
            { data: doc.data(), id: doc.id },
          ]);
        });
      }
    }

    loadPost();
  }, []);

  const loadNextPost = async () => {
    const lastLoadedPost = postList[postList.length - 1];

    const next = await database
      .collection("posts")
      .orderBy("created_at", "desc")
      .startAfter(lastLoadedPost.data.created_at)
      .limit(3)
      .get();
    next.forEach((doc) => {
      setPostList((postList) => [
        ...postList,
        { data: doc.data(), id: doc.id },
      ]);
    });
  };

  const loadData = ($event: CustomEvent<void>) => {
    setTimeout(() => {
      loadNextPost();
      ($event.target as HTMLIonInfiniteScrollElement).complete();
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

      setPostList((postList) => [{ data: post, id: res.id }, ...postList]);
      toast("Đăng thành công");
      setShowPopover(false);
      window.location.reload();
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
            {postList
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
