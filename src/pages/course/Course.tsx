import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButton, IonMenuButton, IonIcon, IonBackButton, IonButtons, IonSplitPane, IonList, IonLabel, IonToggle, IonLoading } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import LessonList from '../../components/lesson/LessonList';
import { database } from '../../config/firebaseConfig';

interface MatchParams {
  id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> { }

const Course: React.FC<ContainerProps> = ({ match }) => {
  const [busy, setBusy] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  useEffect(() => {
    async function getInfo() {
      const ref = database.collection('courses').doc(match.params.id)
      const doc: any = await ref.get()
      if (!doc.exists) {
        console.log('No such document!')
      } else {
        setName(doc.data().name)
      }
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
        
        <LessonList courseId={match.params.id}/>
      </IonContent>
    </IonPage>
  );
};

export default Course
