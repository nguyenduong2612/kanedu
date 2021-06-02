import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonList,
  IonSearchbar,
  IonMenuButton,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import SearchItemContainer from "../../components/containers/SearchItemContainer";
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
          <IonList lines="none" className="max-width-700">
            {searchResult.map((item: object, index: number) => {
              if (searchIndex === "posts") {
                var page = "community";
              } else {
                page = searchIndex;
              }
              return (
                <SearchItemContainer
                  key={index}
                  page={page}
                  searchItem={item}
                />
              );
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
        <IonToolbar mode="md">
          <IonSegment
            className="search-segment"
            value={searchIndex}
            color="light"
            onIonChange={(e: any) => setSearchIndex(e.detail.value!)}
            mode="md"
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
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
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
