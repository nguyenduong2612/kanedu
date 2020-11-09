import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButton, IonMenuButton, IonIcon, IonBackButton, IonButtons, IonSplitPane, IonList, IonLabel, IonToggle, IonLoading } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { database } from '../config/firebaseConfig';

interface MatchParams {
  id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> { }

const Course: React.FC<ContainerProps> = ({ match }) => {
  const [busy, setBusy] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  useEffect(() => {
    async function getInfo() {
      setBusy(true)
      const ref = database.collection('courses').where('id', '==', Number(match.params.id)).limit(1)
      const docs = await ref.get()
      if (docs.empty) {
        console.log('No such document!')
      } else {
        docs.forEach(doc => {
          setName(doc.data().name)
        })
      }

      setBusy(false)
    }
    
    getInfo()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color='dark' defaultHref="/" />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message='Please wait' duration={0} isOpen={busy}/>
      <IonContent fullscreen>
        
      </IonContent>
    </IonPage>
  );
};

export default Course
