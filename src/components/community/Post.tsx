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
} from "@ionic/react";
import {
  chatboxOutline,
  heartOutline,
} from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React from "react";

interface ContainerProps {
  post: any;
  key: number;
}

const Post: React.FC<ContainerProps> = ({ post }) => {
  return (
    <IonItem lines="none">
      <IonCard style={{ width: "100%" }}>
        <IonCardHeader>
          <IonText style={{ fontSize: 20, color: "black" }}>
            {post.data().title}
          </IonText>
        </IonCardHeader>
        <IonCardContent>
          <IonRow>
            <div>
              <img
                style={{ borderRadius: "50%", width: "95%", maxWidth: 50 }}
                src={post.data().profileURL}
              />
            </div>
            <div style={{ paddingLeft: 10 }}>
              <p>{post.data().author}</p>
              <p>{moment(post.data().created_at).locale("vi").fromNow()}</p>
            </div>
          </IonRow>

          <IonRow>
            <p style={{ paddingTop: 5 }}>{post.data().content}</p>
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
            <IonButton
              size="default"
              style={{ width: "100%", fontSize: 12 }}
              color="dark"
              fill="clear"
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

export default Post;
