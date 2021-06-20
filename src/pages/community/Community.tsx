import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonCol,
  IonRow,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  useIonRouter,
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
import { chatbox, heart, home, pencil } from "ionicons/icons";

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
  const router = useIonRouter();

  const [segmentValue, setSegmentValue] = useState<string>("home");
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

  async function handleSendQuestion(
    title: string,
    content: string,
    image_url?: string
  ) {
    if (title.trim() === "" || content.trim() === "") {
      toast("Hãy nhập tiêu đề và nội dung câu hỏi");
    } else {
      let postData = {};
      if (image_url) {
        postData = {
          author: user.name,
          author_id: user.uid,
          title: title,
          content: content,
          likes: 0,
          comments: 0,
          created_at: Date.now(),
          image_url: image_url,
        };
      } else {
        postData = {
          author: user.name,
          author_id: user.uid,
          title: title,
          content: content,
          likes: 0,
          comments: 0,
          created_at: Date.now(),
        };
      }

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
          <IonTitle>
            {!user.is_admin
              ? segmentValue === "home"
                ? "Cộng đồng"
                : segmentValue === "like"
                ? "Được yêu thích nhất"
                : "Được quan tâm nhất"
              : "Quản lý bài đăng"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {user.verified ? (
        <>
          <IonContent
            fullscreen
            scrollEvents={true}
            onIonScroll={(e: any) => handleScroll(e)}
          >
            <Refresher />
            <IonRow id="post-input-wrapper" className="row max-width-700">
              <IonCol size="2" className="col">
                <div className="image-wrapper">
                  <img
                    alt="user-avatar"
                    id="community-avatar"
                    src={user.profileURL}
                    onClick={() => !user.is_admin && router.push("/my-profile")}
                  />
                </div>
              </IonCol>
              <IonCol size="10" className="col">
                <IonSegment
                  mode="md"
                  value={segmentValue}
                  color="primary"
                  className="part-segment"
                  onIonChange={(e: any) => setSegmentValue(e.detail.value!)}
                >
                  <IonSegmentButton value="home">
                    <IonIcon icon={home}></IonIcon>
                  </IonSegmentButton>
                  <IonSegmentButton value="like">
                    <IonIcon icon={heart}></IonIcon>
                  </IonSegmentButton>
                  <IonSegmentButton value="comment">
                    <IonIcon icon={chatbox}></IonIcon>
                  </IonSegmentButton>
                </IonSegment>
              </IonCol>
            </IonRow>

            <div className="max-width-700">
              {segmentValue === "home"
                ? posts
                    .filter((post: any) => post !== undefined)
                    .map((post: any, index: number) => {
                      return (
                        <PostContainer
                          key={index}
                          post={post}
                          username={user.name}
                        />
                      );
                    })
                : segmentValue === "like"
                ? posts
                    .filter((post: any) => post !== undefined)
                    .sort((a: any, b: any) => b.likes - a.likes)
                    .map((post: any, index: number) => {
                      return (
                        <PostContainer
                          key={index}
                          post={post}
                          username={user.name}
                        />
                      );
                    })
                : posts
                    .filter((post: any) => post !== undefined)
                    .sort((a: any, b: any) => b.comments - a.comments)
                    .map((post: any, index: number) => {
                      return (
                        <PostContainer
                          key={index}
                          post={post}
                          username={user.name}
                        />
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

          <IonFab id="post-fab" vertical="bottom" horizontal="end">
            <IonFabButton onClick={() => setShowPopover(true)} id="postFabBtn">
              <IonIcon icon={pencil} size="default" />
            </IonFabButton>
          </IonFab>

          <SendQuestionPopup
            isOpen={showPopover}
            handleCloseModal={() => setShowPopover(false)}
            handleSendQuestion={handleSendQuestion}
          />
        </>
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
