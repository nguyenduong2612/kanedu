import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { database } from '../config/firebaseConfig';

interface ContainerProps {
  id: number
}

const CourseContainer: React.FC<ContainerProps> = ({ id }: ContainerProps) => {
  const [name, setName] = useState<string>('')

  useEffect(() => {
    async function getInfo() {
      const ref = database.collection('courses').where('id', '==', id).limit(1)
      const docs = await ref.get()
      if (docs.empty) {
        console.log('No such document!')
      } else {
        docs.forEach(doc => {
          setName(doc.data().name)
        })
      }
    }
    
    getInfo()
  }, [])
  
  return (
    <IonItem lines='none' href={`/courses/${id}`}>
      <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{id}</IonCardSubtitle>
            <IonCardTitle>{name}</IonCardTitle>
          </IonCardHeader>
        </IonCard>
    </IonItem>
  );
};

export default CourseContainer;
