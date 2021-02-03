import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import { toast } from "../utils/toast";
import { database } from "../config/firebaseConfig";
import { algoliaUpdateUser } from "./algoliaHelper";

export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubcribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
      unsubcribe();
    });
  });
}

export async function loginUser(email: string, password: string) {
  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    await firebase.auth().signInWithEmailAndPassword(email, password);
    window.location.replace("/");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function loginWithFacebook() {
  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    var provider = new firebase.auth.FacebookAuthProvider();
    //provider.addScope('user_birthday');
    firebase
      .auth()
      .signInWithRedirect(provider)
      .then(async function (data: any) {
        const user = {
          birthday: "",
          email: data.user.email,
          name: data.user.displayName,
          profileURL: data.user.photoURL,
          achievements: [],
          exp: 0,
        };
        const doc = await database.collection("users").doc(data.user.uid).get();
        if (!doc.exists) {
          await database.collection("users").doc(data.user.uid).set(user);
        }
      });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function signoutUser() {
  await firebase.auth().signOut();
  window.location.replace("/");
}

export async function signupUser(
  name: string,
  birthday: string,
  email: string,
  password: string,
  profileURL: string
) {
  try {
    const res: any = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const user = {
      email,
      name,
      birthday,
      profileURL,
      achievements: [],
      exp: 0,
    };
    if (algoliaUpdateUser(user, res.user?.uid)) console.log("add algolia ok");

    await database.collection("users").doc(res.user?.uid).set(user);

    window.location.replace("/");
    return true;
  } catch (error) {
    console.log(error);
    toast(error.message, 3000);
    return false;
  }
}

export async function verifyEmail() {
  var user = firebase.auth().currentUser;

  var res = user
    ?.sendEmailVerification()
    .then(function () {
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    });

  return res;
}

export async function forgotPassword(email: string) {
  firebase.auth().useDeviceLanguage();
  var res = firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {
      toast("Vui lòng kiểm tra email của bạn");
      return true;
    })
    .catch(function (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        toast("Vui lòng nhập email đúng định dạng");
      } else if (error.code === "auth/user-not-found") {
        toast("Địa chỉ email không tồn tại");
      } else {
        toast("Có lỗi xảy ra");
      }

      return false;
    });

  return res;
}

export async function reauthenticate(email: string, password: string) {
  var user = firebase.auth().currentUser;
  var credential = firebase.auth.EmailAuthProvider.credential(email, password);

  var res = user
    ?.reauthenticateWithCredential(credential)
    .then(function () {
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    });

  return res;
}

export async function changePassword(password: string) {
  var user = firebase.auth().currentUser;

  var res = user
    ?.updatePassword(password)
    .then(function () {
      toast("Thay đổi mật khẩu thành công");
      return true;
    })
    .catch(function (error) {
      console.log(error);
      toast("Có lỗi xảy ra");
      return false;
    });

  return res;
}
