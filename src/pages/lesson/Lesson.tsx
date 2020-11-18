import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButton, IonMenuButton, IonIcon, IonBackButton, IonButtons, IonSplitPane, IonList, IonLabel, IonToggle, IonLoading } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import LessonList from '../../components/lesson/LessonList';
import { database } from '../../config/firebaseConfig';

interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> { }

const Lesson: React.FC<ContainerProps> = ({ match }) => {
  const [busy, setBusy] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  useEffect(() => {
    async function getInfo() {
      const ref = database.collection('courses').doc(match.params.course_id).collection('lessons').doc(match.params.lesson_id)
      const doc: any = await ref.get()
      if (!doc.exists) {
        console.log('No such document!')
      } else {
        setName(doc.data().title)
      }
    }
    
    getInfo()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color='dark' defaultHref={`/courses/${match.params.course_id}`} />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message='Please wait' duration={0} isOpen={busy}/>
      <IonContent fullscreen>
        
        {/* <LessonList courseId={match.params.id}/> */}
      </IonContent>
    </IonPage>
  );
};

export default Lesson
