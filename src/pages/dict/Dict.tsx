import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonList,
  IonMenuButton,
  IonSearchbar,
  IonItem,
} from "@ionic/react";
import algoliasearch from "algoliasearch";
import React, { useEffect, useState } from "react";
import ErrorPage from "../../components/error_pages/ErrorPage";
import "./Dict.scss";

const client = algoliasearch(
  String(process.env.REACT_APP_ALGOLIA_APP_ID),
  String(process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY)
);

interface SearchResultProps {
  searchResult: object[];
  searchTerm: string;
}

const SearchResult: React.FC<SearchResultProps> = ({
  searchTerm,
  searchResult,
}) => {
  return (
    <>
      {searchTerm.trim() !== "" ? (
        searchResult.length !== 0 ? (
          <IonList>
            {searchResult.slice(0, 15).map((item: any, index: number) => {
              return (
                <IonItem
                  button
                  key={index}
                  mode="ios"
                  className="search-result-item"
                >
                  <div className="item-wrapper">
                    <p className="keyword">{item.keyword}</p>
                    <p className="meaning">{item.meaning}</p>
                  </div>
                </IonItem>
              );
            })}
          </IonList>
        ) : (
          <ErrorPage>Không tìm thấy kết quả phù hợp</ErrorPage>
        )
      ) : (
        <ErrorPage>Nhập từ khóa để bắt đầu</ErrorPage>
      )}
    </>
  );
};

interface DictPageProps {}

const Dict: React.FC<DictPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<object[]>([]);

  useEffect(() => {
    const handleSearch = () => {
      if (searchTerm.trim() === "") {
        return;
      } else {
        const dict_index = client.initIndex("dict");

        dict_index.search(searchTerm).then(({ hits }) => {
          setSearchResult(hits);
        });
      }
    };

    handleSearch();
  }, [searchTerm]);

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
            placeholder="Tra từ Nhật - Việt, Việt - Nhật"
            mode="ios"
            style={{ marginTop: 10, paddingBottom: 5 }}
            color="light"
          />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <SearchResult searchTerm={searchTerm} searchResult={searchResult} />
      </IonContent>
    </IonPage>
  );
};

export default Dict;
