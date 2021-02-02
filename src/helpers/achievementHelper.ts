import * as firebase from "firebase/app";
import { database } from "../config/firebaseConfig";

export async function addAchievement(
  currentUser: any,
  achievementId: string,
  exp: number
) {
  let userRef = database.collection("users").doc(currentUser.user.uid);

  if (!currentUser.user.achievements.includes(achievementId)) {
    userRef.update({
      achievements: firebase.firestore.FieldValue.arrayUnion(achievementId),
      exp: firebase.firestore.FieldValue.increment(exp),
    });
  }
}
