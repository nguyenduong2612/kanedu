import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButton, IonMenuButton, IonIcon, IonBackButton, IonButtons, IonSplitPane, IonList, IonLabel, IonToggle, IonItemDivider, IonItemGroup, IonLoading } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './Profile.css';
import { database } from '../config/firebaseConfig';
import { userInfo } from 'os';

interface ContainerProps { }

const Profile: React.FC<ContainerProps> = (props) => {
  const [busy, setBusy] = useState<boolean>(false)
  const [user, setUser] = useState<any>(props)
  const [username, setUsername] = useState<string>('')
  const [birthday, setBirthday] = useState<string>('')
  useEffect(() => {

    async function getInfo() {
      setBusy(true)
      const cityRef = database.collection('users').where('uid', '==', user.uid).limit(1)
      const docs = await cityRef.get()
      if (docs.empty) {
        console.log('No such document!')
      } else {
        docs.forEach(doc => {
          setUsername(doc.data().name)
          setBirthday(doc.data().birthday)
        })
      }

      setBusy(false)
    }
    
    getInfo()
  }, [])

  return (
      <IonPage id='main'>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton color='dark' defaultHref="/" />
            </IonButtons>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonLoading message='Please wait' duration={0} isOpen={busy}/>
        <IonContent fullscreen>
          <IonList>
            <IonItemGroup>
              <IonItem lines='none'>
                <img className='profile-img' src="https://manskkp.lv/assets/images/users/default-user.png" width="100" height="100" />
              </IonItem>
              <IonItem lines='none'>
                <b className='username'>{username}</b>
              </IonItem>
              <IonItemDivider />
            </IonItemGroup>

            <IonItemGroup>
              <IonItem lines='none'>
                <IonLabel>Email</IonLabel>
                <p style={{ color: '#aaa'}}>{user.email}</p>
              </IonItem>
              <IonItem lines='none'>
                <IonLabel>Day of Birth</IonLabel>
                <p style={{ color: '#aaa'}}>{birthday}</p>
              </IonItem>
              <IonItemDivider />
            </IonItemGroup>
          </IonList>
        </IonContent>
      </IonPage>
  );
};

export default Profile
