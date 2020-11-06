import * as firebase from 'firebase'
import 'firebase/firestore'
import { toast } from '../utils/toast'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

firebase.initializeApp(config)

export const database = firebase.firestore()

export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubcribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(user)
      } else {
        resolve(null)
      }
      unsubcribe()
    })
  })
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await firebase.auth().signInWithEmailAndPassword(email, password)
    window.location.replace('/')
    return true

  } catch(error) {
    console.log(error)
    return false
  }
}

export async function signoutUser() {
  await firebase.auth().signOut()
  window.location.replace('/')
}

export async function signupUser(name: string, birthday: string, email: string, password: string) {
  try {
    const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
    const user = {
      email: res.user?.email,
      uid: res.user?.uid,
      name,
      birthday
    }
    const userRes = await database.collection('users').add(user)
    //console.log(user)
    return true

  } catch(error) {
    console.log(error)
    toast(error.message, 3000)
    return false
  }
}

export async function verifyEmail() {
  var user = firebase.auth().currentUser;
  
  var res = user?.sendEmailVerification().then(function() {
    return true
  }).catch(function(error) {
    console.log(error)
    return false
  })

  return res
}