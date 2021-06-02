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
  //IonInfiniteScroll,
  //IonInfiniteScrollContent,
} from "@ionic/react";
import React, { useState, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../utils/toast";

import "../../theme/app.css";
import "./Community.scss";
import ErrorPage from "../../components/error_pages/ErrorPage";
import Refresher from "../../components/utils/Refresher";
import SendQuestionPopup from "../../components/popups/SendQuestionPopup";
import { savePost } from "../../redux/post/post.actions";

const PostContainer = lazy(
  () => import("../../components/containers/PostContainer")
);

interface CommunityPageProps {}
interface RootState {
  user: any;
  posts: any;
}

const Community: React.FC<CommunityPageProps> = () => {
  const dispatch = useDispatch();
  const [showPopover, setShowPopover] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.user);
  const { posts } = useSelector((state: RootState) => state.posts);

  // useEffect(() => {
  //   async function loadPost() {
  //     const ref = database.collection("posts");
  //     const docs = await ref.orderBy("created_at", "desc").limit(6).get();

  //     if (docs.empty) {
  //       console.log("No such document!");
  //       return;
  //     } else {
  //       docs.forEach((doc) => {
  //         // setPostList((postList) => [
  //         //   ...postList,
  //         //   { data: doc.data(), id: doc.id },
  //         // ]);

  //         dispatch(addPostToPostList({ data: doc.data(), id: doc.id }));
  //       });
  //     }
  //   }

  //   loadPost();
  // }, [dispatch]);

  // const loadNextPost = async () => {
  //   const lastLoadedPost = postList[postList.length - 1];

  //   const next = await database
  //     .collection("posts")
  //     .orderBy("created_at", "desc")
  //     .startAfter(lastLoadedPost.data.created_at)
  //     .limit(6)
  //     .get();
  //   next.forEach((doc) => {
  //     // setPostList((postList) => [
  //     //   ...postList,
  //     //   { data: doc.data(), id: doc.id },
  //     // ]);
  //     dispatch(addPostToPostList({ data: doc.data(), id: doc.id }));
  //   });
  // };

  // const loadData = ($event: CustomEvent<void>) => {
  //   setTimeout(() => {
  //     loadNextPost();
  //     ($event.target as HTMLIonInfiniteScrollElement).complete();
  //   }, 750);
  // };

  async function handleSendQuestion(title: string, content: string) {
    if (title.trim() === "" || content.trim() === "") {
      toast("Hãy nhập tiêu đề và nội dung câu hỏi");
    } else {
      let postData = {
        author: user.name,
        author_id: user.uid,
        title: title,
        content: content,
        likes: 0,
        comments: 0,
        created_at: Date.now(),
      };

      dispatch(savePost(postData, user.uid));
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

      {user.verified ? (
        <IonContent
          fullscreen
          scrollEvents={true}
          onIonScroll={(e: any) => handleScroll(e)}
        >
          <Refresher />
          <IonGrid id="post-input-wrapper">
            <IonRow className="row max-width-700">
              <IonCol size="2" className="col">
                <div className="image-wrapper">
                  <img
                    alt="user-avatar"
                    id="community-avatar"
                    src={user.profileURL}
                  />
                </div>
              </IonCol>
              <IonCol size="10" className="col">
                <IonButton
                  mode="md"
                  expand="block"
                  fill="outline"
                  color="primary"
                  size="default"
                  onClick={() => setShowPopover(true)}
                >
                  <span>Đặt câu hỏi</span>
                </IonButton>

                <SendQuestionPopup
                  isOpen={showPopover}
                  handleCloseModal={() => setShowPopover(false)}
                  handleSendQuestion={handleSendQuestion}
                />
              </IonCol>
            </IonRow>
          </IonGrid>

          <div className="max-width-700">
            {posts
              .filter((post: any) => post !== undefined)
              .map((post: any, index: number) => {
                return (
                  <PostContainer key={index} post={post} username={user.name} />
                );
              })}

            {/* <IonInfiniteScroll
              threshold="100px"
              onIonInfinite={(e: CustomEvent<void>) => loadData(e)}
            >
              <IonInfiniteScrollContent loadingText="Đang tải thêm"></IonInfiniteScrollContent>
            </IonInfiniteScroll> */}
          </div>
        </IonContent>
      ) : (
        <IonContent>
          <ErrorPage>
            Vui lòng xác thực email của bạn
            <br />
            <IonButton routerLink="/my-profile/account-settings" fill="clear">
              Chuyển tới trang tài khoản
            </IonButton>
          </ErrorPage>
        </IonContent>
      )}
    </IonPage>
  );
};

export default Community;
