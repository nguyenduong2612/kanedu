import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonList,
  IonSearchbar,
  IonItem,
  IonMenuButton,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import ErrorPage from "../../components/error_pages/ErrorPage";
import { algoliaClient } from "../../config/algoliaConfig";
import "./Search.scss";

const placeholderSelect = (searchIndex: string) => {
  if (searchIndex === "courses") {
    return "Tên khóa học, người đăng";
  } else if (searchIndex === "posts") {
    return "Từ khóa, nội dung câu hỏi, người đăng";
  } else {
    return "Tên người dùng, email";
  }
};

interface SearchResultProps {
  searchResult: object[];
  searchIndex: string;
  searchTerm: string;
}

const SearchResult: React.FC<SearchResultProps> = ({
  searchTerm,
  searchIndex,
  searchResult,
}) => {
  return (
    <>
      {searchTerm.trim() !== "" ? (
        searchResult.length !== 0 ? (
          <IonList lines="none">
            {searchResult.map((item: any, index: number) => {
              if (searchIndex === "courses") {
                return (
                  <IonItem
                    routerLink={`/courses/${item.objectID}`}
                    key={index}
                    mode="ios"
                  >
                    {item.name}
                  </IonItem>
                );
              } else if (searchIndex === "posts") {
                return (
                  <IonItem
                    routerLink={`/community/${item.objectID}`}
                    key={index}
                    mode="ios"
                  >
                    {item.title}
                  </IonItem>
                ); //TODO
              } else {
                return (
                  <IonItem
                    routerLink={`/users/${item.objectID}`}
                    key={index}
                    mode="ios"
                  >
                    {item.name}
                  </IonItem>
                );
              }
            })}
          </IonList>
        ) : (
          <ErrorPage>Không tìm thấy kết quả phù hợp</ErrorPage>
        )
      ) : (
        <ErrorPage>Nhập từ khóa để bắt đầu tìm kiếm</ErrorPage>
      )}
    </>
  );
};

interface SearchPageProps {}

const Search: React.FC<SearchPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchIndex, setSearchIndex] = useState<string>("courses");
  const [searchResult, setSearchResult] = useState<object[]>([]);

  useEffect(() => {
    const handleSearch = () => {
      if (searchTerm.trim() === "") {
        return;
      } else {
        const index = algoliaClient.initIndex(searchIndex);

        index.search(searchTerm).then(({ hits }) => {
          setSearchResult(hits);
        });
      }
    };

    handleSearch();
  }, [searchTerm, searchIndex]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="light"
            style={{ marginTop: 14 }}
          ></IonMenuButton>
          <IonSearchbar
            value={searchTerm}
            onIonChange={(e: any) => setSearchTerm(e.detail.value!)}
            placeholder={placeholderSelect(searchIndex)}
            mode="ios"
            style={{ marginTop: 10, paddingBottom: 5 }}
            color="light"
          />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonSegment
          scrollable
          value={searchIndex}
          color="primary"
          onIonChange={(e: any) => setSearchIndex(e.detail.value!)}
        >
          <IonSegmentButton value="courses">
            <IonLabel>Khóa học</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="posts">
            <IonLabel>Bài đăng</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="users">
            <IonLabel>Người dùng</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <SearchResult
          searchTerm={searchTerm}
          searchIndex={searchIndex}
          searchResult={searchResult}
        />
      </IonContent>
    </IonPage>
  );
};

export default Search;
