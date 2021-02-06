import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { heart } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { fetchUserAvatar } from "../../helpers/firebaseHelper";
import "./CourseContainer.scss";

interface CourseContainerProps {
  id: string;
  name: string;
  author: string;
  author_id: string;
  description: string;
  followers: number;
}

const CourseContainer: React.FC<CourseContainerProps> = ({
  id,
  name,
  author,
  author_id,
  description,
  followers,
}: CourseContainerProps) => {
  const [profileURL, setProfileURL] = useState<string>();

  useEffect(() => {
    async function getProfileUrl() {
      setProfileURL(await fetchUserAvatar(author_id));
    }

    getProfileUrl();
  }, [author_id]);

  return (
    <IonItem lines="none" routerLink={`/courses/${id}`}>
      <IonCard mode="ios" className="course-wrapper">
        <IonCardHeader>
          <IonCardSubtitle className="course-wrapper__author" mode="md">
            <img
              alt="avatar"
              className="course-wrapper__author-avatar"
              src={profileURL}
            ></img>
            <span>{author}</span>
          </IonCardSubtitle>
          <IonCardTitle className="course-wrapper__title" mode="md">
            <b>{name}</b>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent className="course-wrapper__des" mode="md">
          {description}
        </IonCardContent>

        <IonButton mode="md" size="default" fill="clear">
          <IonIcon slot="icon-only" icon={heart} />
          <IonLabel style={{ paddingLeft: 5 }}>
            {followers ? followers : 0}
          </IonLabel>
        </IonButton>
      </IonCard>
    </IonItem>
  );
};

export default CourseContainer;
