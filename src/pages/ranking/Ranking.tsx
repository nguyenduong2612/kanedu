import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonMenuButton,
  IonCard,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
} from "@ionic/react";
import { flame } from "ionicons/icons";
import React from "react";
import Spinner from "../../components/utils/Spinner";
import useRanking from "../../hooks/ranking/useRanking";
import "./Ranking.scss";

interface RankingPageProps {}

const Ranking: React.FC<RankingPageProps> = () => {
  const ranking = useRanking();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="light"
          ></IonMenuButton>
          <IonTitle>Bảng xếp hạng</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="max-width-700">
          {ranking.isLoaded ? (
            ranking.topten.map((user: any, index: number) => {
              return (
                <IonCard
                  id={`rank-${index + 1}-card`}
                  mode="ios"
                  key={index}
                  routerLink={`/users/${user.uid}`}
                >
                  <IonGrid>
                    <IonRow>
                      <IonCol size="2" className="rank-number__wrapper">
                        <span
                          className="rank-number__number"
                          id={`rank-${index + 1}`}
                        >
                          {index + 1}
                        </span>
                      </IonCol>
                      <IonCol size="10" className="rank-info__wrapper">
                        <img
                          alt="avatar"
                          className="rank-info__img"
                          src={user.profileURL}
                        ></img>
                        <div className="rank-info__name">{user.name}</div>
                        <div className="rank-info__exp">
                          <IonIcon icon={flame} color="primary"></IonIcon>
                          {user.exp}
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCard>
              );
            })
          ) : (
            <Spinner />
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Ranking;
