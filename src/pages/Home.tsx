import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButton, IonMenu, IonList, IonApp, IonMenuButton, IonSplitPane } from '@ionic/react';
import React, { useState } from 'react';
import './Home.css';
import SideMenu from '../components/sidemenu/SideMenu';

const Home: React.FC = (props) => {
  const [user, setUser] = useState<any>(props)

  //console.log(user.email)
  return (
    <IonSplitPane contentId="main">
      <SideMenu {...user} />
      <IonPage id='main'>
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" className='menu-btn' color='dark'></IonMenuButton>
            <IonTitle>Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        
          <IonItem lines='none'>
            <p>{user.email}</p>
          </IonItem>

        </IonContent>
      </IonPage>
    </IonSplitPane>
  );
};

export default Home
