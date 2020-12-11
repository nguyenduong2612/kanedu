import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonSearchbar,
  IonItem,
  IonMenuButton,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import algoliasearch from "algoliasearch";
import React, { useState, useEffect } from "react";

const client = algoliasearch(
  String(process.env.REACT_APP_ALGOLIA_APP_ID),
  String(process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY)
);

const placeholderSelect = (searchIndex: string) => {
  if (searchIndex === "courses") {
    return "Tên khóa học, người đăng"
  } else if (searchIndex === "posts") {
    return "Từ khóa, nội dung câu hỏi, người đăng"
  } else {
    return "Tên người dùng, email"
  }
}

interface ContainerProps {}

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
        <IonList lines="none">
          {searchResult.length !== 0 ? (searchResult.map((item: any, index: number) => {
            if (searchIndex === "courses") {
              return <IonItem routerLink={`/courses/${item.objectID}`} key={index}>{item.name}</IonItem>;
            } else if (searchIndex === "posts") {
              return <IonItem routerLink={`/community`} key={index}>{item.title}</IonItem>; //TODO
            } else {
              return <IonItem key={index}>{item.name}</IonItem>; //TODO
            }
          })) : (
            <IonItem lines="none">Không tìm thấy</IonItem>
          )}
        </IonList>
      ) : (
        <IonItem lines="none"></IonItem>
      )}
    </>
  );
};

const Search: React.FC<ContainerProps> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchIndex, setSearchIndex] = useState<string>("courses");
  const [searchResult, setSearchResult] = useState<object[]>([]);

  useEffect(() => {
    const handleSearch = () => {
      if (searchTerm.trim() === "") {
        return;
      } else {
        const index = client.initIndex(searchIndex);

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
        <IonToolbar>
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="dark"
          ></IonMenuButton>
          <IonTitle>Tìm kiếm</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonSearchbar
          value={searchTerm}
          onIonChange={(e: any) => setSearchTerm(e.detail.value!)}
          placeholder={placeholderSelect(searchIndex)}
        />

        <IonSegment
          value={searchIndex}
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
