import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import '../../theme/app.css'

interface ContainerProps { }

const VerifyRequest: React.FC = () => {
  return (
    <div className="container">
      <strong>Please verify your email</strong>
    </div>
  );
}

const Community: React.FC<ContainerProps> = (props) => {
  const [user, setUser] = useState<any>(props)
  const [verified, setVerified] = useState<boolean>(user.emailVerified)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color='dark' defaultHref="/" />
          </IonButtons>
          <IonTitle>Community</IonTitle>
        </IonToolbar>
      </IonHeader>
      {verified
        ? <IonContent fullscreen>
            
          </IonContent>
        : <VerifyRequest />
      }
    </IonPage>
  );
};

export default Community;
