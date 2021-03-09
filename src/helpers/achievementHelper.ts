import firebase from "firebase/app";
import { database } from "../config/firebaseConfig";
import { achievementToast } from "../utils/achievementToast";

export async function addAchievement(user: any, achievementId: string, action?: string) {
  let userRef = database.collection("users").doc(user.uid);

  if (
    user.achievements.filter(
      (achievement: any) => achievement.id === achievementId
    ).length > 0
  ) {
    return false;
  } else {
    let res: any = await database
      .collection("achievements")
      .doc(achievementId)
      .get();
    let achievement = res.data();
    achievement.id = achievementId;

    userRef.update({
      achievements: firebase.firestore.FieldValue.arrayUnion(achievement),
      exp: firebase.firestore.FieldValue.increment(achievement.exp),
    });

    achievementToast(achievement, action);

    return true;
  }
}
