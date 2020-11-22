import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonMenuButton } from '@ionic/react';
import React, { useState } from 'react';
import './Home.css';
import CourseContainer from '../../components/course/CourseContainer';

const Home: React.FC = (props) => {
  const [user, setUser] = useState<any>(props)

  //console.log(user.email)
  return (
    <IonPage>
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

        <CourseContainer id={'7Rs1TV3r2jPqKH7cJQYR'} />

      </IonContent>
    </IonPage>
  );
};

export default Home
