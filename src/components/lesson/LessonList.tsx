import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { database } from '../../config/firebaseConfig';

interface ContainerProps {
  courseId: string
}

const LessonList: React.FC<ContainerProps> = ({ courseId }: ContainerProps) => {
  const [name, setName] = useState<string>('')
  const [lessonList, setLessonList] = useState<any[]>([])

  useEffect(() => {
    async function getAllLesson() {
      const ref = database.collection('courses').doc(courseId).collection('lessons')
      const docs = await ref.get()
      if (docs.empty) {
        console.log('No such document!')
      } else {
        docs.forEach(doc => {
          setLessonList(lessonList => [...lessonList, doc])
        })
      }
    }
  
    getAllLesson()
  }, [])
  
  return (
    <>
      {lessonList.map((lesson: any, index: number) => {
        return <IonItem lines='none' key={index} href={`/courses/${courseId}/${lesson.id}`}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{lesson.data().title}</IonCardTitle>
                  </IonCardHeader>
                </IonCard>
              </IonItem>
      })}
    </>
  );
};

export default LessonList;
