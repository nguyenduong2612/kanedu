import { IonContent, IonText, IonItem, IonInput, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonLabel, IonLoading } from '@ionic/react';
import React, { useState } from 'react';
//import './Register.css';
import { Plugins } from '@capacitor/core';
import { Link } from 'react-router-dom';
import { signupUser } from '../config/firebaseConfig';
import { toast } from '../utils/toast';

const Register: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  async function signup() {
    if (email.trim() === '' || password.trim() === '') {
      return toast('Email and password are required')
    }

    if (password == confirmPassword) {
      setBusy(true)
      const res = await signupUser(email, password)

      if (res) {
        toast('Register success')
      } else { 
        console.log('Register failed') 
      }
      setBusy(false)
    } else {
      toast('Passwords do not match')
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message='Please wait' duration={0} isOpen={busy}/>
      <IonContent fullscreen>
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

        <IonItem>
          <IonLabel position="floating">Confirm Password</IonLabel>
          <IonInput 
            type='password'
            value={confirmPassword} 
            onIonChange={(e: any) => setConfirmPassword(e.target.value)}
          ></IonInput>
        </IonItem>

        <IonButton 
          className='ion-margin'
          expand="block"
          onClick={signup}
        >REGISTER</IonButton>

        <IonItem lines="none">
          <p>Already have an account? <Link to='/login'>Login</Link></p>
        </IonItem>

      </IonContent>
    </IonPage>
  )
}

export default Register;