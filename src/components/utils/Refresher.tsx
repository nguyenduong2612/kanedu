import { IonRefresher, IonRefresherContent } from "@ionic/react";
import React from "react";
import { RefresherEventDetail } from "@ionic/core";

interface RefresherContainerProps {}

const Refresher: React.FC<RefresherContainerProps> = () => {
  async function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    window.location.reload();
    event.detail.complete();
  }

  return (
    <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
      <IonRefresherContent></IonRefresherContent>
    </IonRefresher>
  );
};

export default Refresher;
