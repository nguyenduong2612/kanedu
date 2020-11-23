import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonBackButton, IonButtons, IonList, IonSearchbar, IonFooter, IonItem } from '@ionic/react';
import algoliasearch from 'algoliasearch';
import React, { useState, useEffect } from 'react';

interface ContainerProps { }

interface SearchResultProps {
  searchResult: object[]
}

const SearchResult: React.FC<SearchResultProps> = ({ searchResult }) => {
  return (
    <IonList lines='none'>
      {
        searchResult.map((item: any, index: number) => {
          return <IonItem key={index}>{item.name}, {item.email}</IonItem>
        })
      }
    </IonList>
  )
}

const Search: React.FC<ContainerProps> = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResult, setSearchResult] = useState<object[]>([])

  useEffect(() => {
    const handleSearch = () => {
      const client = algoliasearch(
        String(process.env.REACT_APP_ALGOLIA_APP_ID), 
        String(process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY)
      )

      const index = client.initIndex('users');

      index.search(searchTerm).then(({ hits }) => {
        setSearchResult(hits)
      });
    }

    handleSearch()
  }, [searchTerm]);

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton color='dark' defaultHref="/" />
            </IonButtons>
            <IonTitle>Search</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
        
          <IonSearchbar 
            value={searchTerm} 
            onIonChange={(e: any) => setSearchTerm(e.detail.value!)} 
            placeholder='Search by name or email'
          />
          <SearchResult searchResult={searchResult} />

        </IonContent>
      </IonPage>
  );
};

export default Search
