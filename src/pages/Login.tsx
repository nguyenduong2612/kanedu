import { IonContent, IonItem, IonLabel, IonInput, IonList, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonImg, IonText, IonLoading } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './Login.css';
import { Plugins } from '@capacitor/core';
import { Link } from 'react-router-dom';
import { loginUser } from '../config/firebaseConfig';
import { toast } from '../utils/toast';

const Login: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // useEffect(() => {
  //   console.log(email, password)
  // })

  async function login() {
    if (email.trim() === '' || password.trim() === '') {
      return toast('Email and password are required')
    }

    setBusy(true)
    const res = await loginUser(email, password)

    if (res) {
      toast('Login success')
    } else {
      toast('Password does not match')
      setPassword('')
    }

    setBusy(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message='Please wait' duration={0} isOpen={busy}/>
      <IonContent fullscreen >

        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput 
            type='email'
            value={email} 
            onIonChange={(e: any) => setEmail(e.target.value)}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput 
            type='password'
            value={password} 
            onIonChange={(e: any) => setPassword(e.target.value)}
          ></IonInput>
        </IonItem>

        <IonButton 
          className='ion-margin'
          expand="block"
          onClick={login}
        >LOGIN</IonButton>

        <IonItem lines="none">
          <p>New here? <Link to='/register'>Register</Link></p>
        </IonItem>
        
      </IonContent>
    </IonPage>
  )
}

export default Login;