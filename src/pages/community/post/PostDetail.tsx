import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";

interface MatchParams {
  post_id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const PostDetail: React.FC<ContainerProps> = ({ match }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/" />
          </IonButtons>
          <IonTitle>Bài đăng</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <p>{match.params.post_id}</p>
      </IonContent>
    </IonPage>
  );
};

export default PostDetail;
