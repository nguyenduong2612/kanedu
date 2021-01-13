import {
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonText,
  IonLabel,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
  IonModal,
  IonInput,
} from "@ionic/react";
import {
  chatboxOutline,
  closeOutline,
  closeSharp,
  heartOutline,
  sendOutline,
  sendSharp,
} from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { database, storage } from "../../config/firebaseConfig";
import "./PostContainer.scss";

interface ContainerProps {
  key: number;
  post: any;
  username: string;
}

const PostContainer: React.FC<ContainerProps> = ({ post, username }) => {
  const [profileURL, setProfileURL] = useState<string>("");
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");

  const [commentList, setCommentList] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState<number>();

  useEffect(() => {
    async function getProfileURL() {
      const storageRef = storage.ref();

      const fileName = `${post.data.author_id}`;
      const fileRef = storageRef.child("users_avatar/" + fileName);

      setProfileURL(await fileRef.getDownloadURL());
    }

    getProfileURL();
  }, [post.data.author_id]);


  const handleSendComment = async () => {
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

      setCommentInput("");
      setCommentList((commentList) => [
        ...commentList,
        { data: comment, id: res.id },
      ]);
    }
  };

  const handleShowModal = () => {
    setShowCommentModal(true);
    getAllComment();
  };

  const handleCloseModal = () => {
    setShowCommentModal(false);
    setCommentList([]);
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
    <IonItem lines="none">
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
            >
              <IonIcon slot="icon-only" icon={heartOutline} />
              <IonLabel style={{ paddingLeft: 7, overflow: "unset" }}>
                Yêu thích
              </IonLabel>
            </IonButton>
          </IonCol>

          <IonCol size="6">
            {/* comment modal */}
            <IonModal
              swipeToClose={true}
              isOpen={showCommentModal}
              cssClass="comment-modal"
              onDidDismiss={handleCloseModal}
              mode="ios"
            >
              <div className="comment-list-wrapper">
                <IonItem lines="none" className="modal-title">
                  ({commentCount ? commentCount : 0}) Bình luận
                  <IonButton fill="clear" onClick={handleCloseModal} slot="end">
                    <IonIcon
                      color="dark"
                      slot="icon-only"
                      ios={closeOutline}
                      md={closeSharp}
                    />
                  </IonButton>
                </IonItem>
                {commentList.map((comment: any, index: number) => {
                  return (
                    <div className="comment-wrapper" key={index}>
                      <b>{`${comment.data.author} | 
                          ${moment(comment.data.created_at)
                            .locale("vi")
                            .fromNow()}`}</b>
                      <p>{comment.data.content}</p>
                    </div>
                  );
                })}
              </div>
              <IonItem lines="none" className="comment-input-wrapper">
                <IonInput
                  value={commentInput}
                  placeholder="Nhập bình luận"
                  onIonChange={(e) => setCommentInput(e.detail.value!)}
                ></IonInput>
                <IonButton
                  size="default"
                  color="dark"
                  fill="clear"
                  onClick={handleSendComment}
                >
                  <IonIcon
                    className="send-icon"
                    color="primary"
                    ios={sendOutline}
                    md={sendSharp}
                  />
                </IonButton>
              </IonItem>
            </IonModal>

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
    </IonItem>
  );
};

export default PostContainer;
