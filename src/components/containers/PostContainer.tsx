import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonText,
  IonLabel,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
} from "@ionic/react";
import * as firebase from "firebase/app";
import { chatboxOutline, heartOutline, heartSharp } from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database, storage } from "../../config/firebaseConfig";
import CommentsModal from "../modals/CommentsModal";
import "./PostContainer.scss";

interface PostContainerProps {
  key: number;
  post: any;
  username: string;
}

interface RootState {
  user: any;
  posts: any;
}

const PostContainer: React.FC<PostContainerProps> = ({ post, username }) => {
  const [profileURL, setProfileURL] = useState<string>("");
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

  const [commentList, setCommentList] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);

  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const currentUser = useSelector((state: RootState) => state.user);
  const favoritePosts = useSelector(
    (state: RootState) => state.posts.favoritePosts
  );

  useEffect(() => {
    async function getProfileURL() {
      const storageRef = storage.ref();

      const fileName = `${post.data.author_id}`;
      const fileRef = storageRef.child("users_avatar/" + fileName);

      setProfileURL(await fileRef.getDownloadURL());
    }

    if (favoritePosts.includes(post.id)) setIsFavorited(true);

    getProfileURL();
  }, [favoritePosts, post.id, post.data.author_id]);

  const handleSendComment = async (commentInput: string) => {
    if (commentInput.trim() !== "") {
      let comment = {
        author: username,
        content: commentInput,
        created_at: Date.now(),
      };

      const res = await database
        .collection("posts")
        .doc(post.id)
        .collection("comments")
        .add(comment);

      setCommentList((commentList) => [
        ...commentList,
        { data: comment, id: res.id },
      ]);
    }
  };

  const handleShowModal = () => {
    setShowCommentModal(true);
    getAllComment();
    console.log(isFavorited, post.id)
  };

  const handleCloseModal = () => {
    setShowCommentModal(false);
    setCommentList([]);
  };

  const handleLikePost = () => {
    setIsFavorited(true);
    //dispatch(setFavoritePost(post.id));

    let ref = database.collection("users").doc(currentUser.user.uid);
    ref.update({
      favorite_posts: firebase.firestore.FieldValue.arrayUnion(post.id),
    });
  };

  const handleUnlikePost = () => {
    setIsFavorited(false);
    //dispatch(setFavoritePost(post.id));

    let ref = database.collection("users").doc(currentUser.user.uid);
    ref.update({
      favorite_posts: firebase.firestore.FieldValue.arrayRemove(post.id),
    });
  };

  async function getAllComment() {
    const ref = database
      .collection("posts")
      .doc(post.id)
      .collection("comments");
    const docs = await ref.orderBy("created_at").get();
    if (docs.empty) {
      console.log("No such document!");
    } else {
      docs.forEach((doc) => {
        setCommentList((commentList) => [
          ...commentList,
          { data: doc.data(), id: doc.id },
        ]);
        setCommentCount(docs.size);
      });
    }
  }

  return (
    <div>
      <IonCard
        className="post-wrapper"
        /*routerLink={`/community/${post.id}`}*/
      >
        <IonCardHeader>
          <IonText style={{ fontSize: 20, color: "black" }}>
            {post.data.title}
          </IonText>
        </IonCardHeader>
        <IonCardContent>
          <IonRow>
            <div>
              <img
                alt="avatar"
                style={{ borderRadius: "50%", width: "95%", maxWidth: 50 }}
                src={profileURL}
              />
            </div>
            <div style={{ paddingLeft: 10 }}>
              <p>{post.data.author}</p>
              <p>{moment(post.data.created_at).locale("vi").fromNow()}</p>
            </div>
          </IonRow>

          <IonRow>
            <p className="post-content">{post.data.content}</p>
            <br></br>
            {post.data.sharedLink && (
              <IonButton href={post.data.sharedLink} fill="outline">
                Tham gia
              </IonButton>
            )}
          </IonRow>
        </IonCardContent>

        <IonRow style={{ borderTop: "1px solid #bbb", margin: "0 15px" }}>
          <IonCol size="6">
            <IonButton
              size="default"
              style={{ width: "100%", fontSize: 12 }}
              color="dark"
              fill="clear"
              onClick={isFavorited ? handleUnlikePost : handleLikePost}
            >
              {isFavorited ? (
                <IonIcon color="primary" slot="icon-only" icon={heartSharp} />
              ) : (
                <IonIcon slot="icon-only" icon={heartOutline} />
              )}
              <IonLabel style={{ paddingLeft: 7, overflow: "unset" }}>
                Yêu thích
              </IonLabel>
            </IonButton>
          </IonCol>

          <IonCol size="6">
            <CommentsModal
              isOpen={showCommentModal}
              commentCount={commentCount}
              commentList={commentList}
              handleCloseModal={handleCloseModal}
              handleSendComment={handleSendComment}
            />

            <IonButton
              size="default"
              style={{ width: "100%", fontSize: 12 }}
              color="dark"
              fill="clear"
              onClick={handleShowModal}
            >
              <IonIcon slot="icon-only" icon={chatboxOutline} />
              <IonLabel style={{ paddingLeft: 7, overflow: "unset" }}>
                Bình luận
              </IonLabel>
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCard>
    </div>
  );
};

export default PostContainer;
