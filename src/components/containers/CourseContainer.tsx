import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonLabel,
  IonSkeletonText,
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
  const [isAvatarLoaded, setIsAvatarLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function getProfileUrl() {
      setProfileURL(await fetchUserAvatar(author_id));
      setIsAvatarLoaded(true);
    }

    getProfileUrl();
  }, [author_id]);

  return (
    <IonCard
      mode="ios"
      className="course-wrapper"
      routerLink={`/courses/${id}`}
    >
      {isAvatarLoaded ? (
        <>
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
        </>
      ) : (
        <div className="ion-padding">
          <IonSkeletonText
            animated
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            slot="start"
          />
          <IonSkeletonText
            animated
            style={{ width: "75%", margin: "10px 0" }}
          />
          <IonSkeletonText
            animated
            style={{ width: "50%", margin: "10px 0" }}
          />
          <IonSkeletonText
            animated
            style={{ width: "25%", margin: "10px 0" }}
          />
        </div>
      )}
    </IonCard>
  );
};

export default CourseContainer;
