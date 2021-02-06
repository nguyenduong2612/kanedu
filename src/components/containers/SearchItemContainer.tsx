import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { fetchUserAvatar } from "../../helpers/firebaseHelper";
import "./SearchItemContainer.scss";

interface SearchItemContainerProps {
  searchItem: any;
  page: string;
}

const SearchItemContainer: React.FC<SearchItemContainerProps> = ({
  searchItem,
  page,
}) => {
  const [profileURL, setProfileURL] = useState<string>();

  useEffect(() => {
    async function getProfileUrl() {
      setProfileURL(
        await fetchUserAvatar(searchItem.author_id || searchItem.objectID)
      );
    }

    getProfileUrl();
  }, [searchItem.author_id, searchItem.objectID]);

  return (
    <IonItem
      lines="none"
      routerLink={`/${page}/${searchItem.objectID}`}
      mode="ios"
    >
      <IonCard mode="ios" className="search-item-wrapper">
        <IonCardHeader style={{ padding: "10px 20px" }}>
          {searchItem.author && (
            <IonCardSubtitle className="search-item-wrapper__author" mode="md">
              <img
                alt="avatar"
                className="search-item-wrapper__author-avatar"
                src={profileURL}
              ></img>
              <span>{searchItem.author}</span>
            </IonCardSubtitle>
          )}

          <IonCardTitle className="search-item-wrapper__title" mode="md">
            {page === "users" ? (
              <>
                <img
                  alt="avatar"
                  className="search-item-wrapper__user-avatar"
                  src={profileURL}
                ></img>
                <span className="search-item-wrapper__username">
                  {searchItem.name}
                </span>
              </>
            ) : (
              <b>{searchItem.name || searchItem.title}</b>
            )}
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent className="search-item-wrapper__des" mode="md">
          {searchItem.description || searchItem.content}
        </IonCardContent>
      </IonCard>
    </IonItem>
  );
};

export default SearchItemContainer;
