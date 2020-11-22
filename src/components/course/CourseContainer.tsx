import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { database } from '../../config/firebaseConfig';

interface ContainerProps {
  id: string
}

const CourseContainer: React.FC<ContainerProps> = ({ id }: ContainerProps) => {
  const [name, setName] = useState<string>('')

  useEffect(() => {
    async function getInfo() {
      const ref: any = database.collection('courses').doc(id)
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
    <IonItem lines='none' routerLink={`/courses/${id}`}>
      <IonCard style={{ width: '100%' }}>
          <IonCardHeader>
            <IonCardTitle>{name}</IonCardTitle>
          </IonCardHeader>
        </IonCard>
    </IonItem>
  );
};

export default CourseContainer;
