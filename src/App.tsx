import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IonApp,
  IonIcon,
  IonContent,
  IonLoading,
  IonSplitPane,
  IonFab,
  IonFabButton,
  IonTitle,
  IonList,
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";
import { Plugins, Capacitor } from "@capacitor/core";
import { getPlatforms } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/app.css";

/* Ionic icons */
import { add } from "ionicons/icons";

import { database, getCurrentUser } from "./config/firebaseConfig";
import { setCurrentUser } from "./redux/reducers/userReducer";
import {
  setFollowingCourses,
  setMyCourses,
} from "./redux/reducers/coursesReducer";

import SideMenu from "./components/sidemenu/SideMenu";
import CreateModal from "./components/modals/CreateModal";
import Routing from "./route/Routing";
import BottomTabbar from "./components/tabbars/BottomTabbar";

// Capacitor plugins
const { StatusBar, Keyboard } = Plugins;

const Loading: React.FC = () => {
  return <IonLoading message="Vui lòng đợi" duration={0} isOpen={true} />;
};

interface RootState {
  user: any;
  logged_in: boolean;
}

const App: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showFabButton, setShowFabButton] = useState<boolean>(true);

  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(getPlatforms());

    const changeStatusBar = () => {
      if (Capacitor.isPluginAvailable("StatusBar")) {
        StatusBar.setBackgroundColor({
          color: "#b589c9",
        });
      }
    };

    const toggleFabButton = () => {
      if (Capacitor.isPluginAvailable("Keyboard")) {
        Keyboard.addListener("keyboardWillShow", () => {
          setShowFabButton(false);
        });

        Keyboard.addListener("keyboardWillHide", () => {
          setShowFabButton(true);
        });
      }
    };

    getCurrentUser().then(async (user: any) => {
      //console.log(user)
      if (user) {
        //window.history.replaceState({}, '', '/')
        const doc: any = await database.collection("users").doc(user.uid).get();
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          let currentUser = {
            uid: doc.id,
            email: doc.data().email,
            name: doc.data().name,
            birthday: doc.data().birthday,
            profileURL: doc.data().profileURL,
            verified: user.emailVerified,
          };
          dispatch(setCurrentUser(currentUser));
        }
      } else {
        window.history.replaceState({}, "", "/welcome");
      }
      setBusy(false);
    });

    changeStatusBar();
    toggleFabButton();
  }, [dispatch]);

  useEffect(() => {
    async function getFollowingCourses() {
      const ref = database
        .collection("courses")
        .where("followed_by", "array-contains", currentUser.user.uid);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let course = {
            id: doc.id,
            author: doc.data().author,
            author_id: doc.data().author_id,
            name: doc.data().name,
            description: doc.data().description,
            followers: doc.data().followed_by?.length,
          };
          dispatch(setFollowingCourses(course));
        });
      }
    }

    async function getMyCourses() {
      const ref = database
        .collection("courses")
        .where("author_id", "==", currentUser.user.uid);
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let course = {
            id: doc.id,
            author: doc.data().author,
            author_id: doc.data().author_id,
            name: doc.data().name,
            description: doc.data().description,
            followers: doc.data().followed_by?.length,
          };
          dispatch(setMyCourses(course));
        });
      }
    }

    getFollowingCourses();
    getMyCourses();
  }, [currentUser.user.uid, dispatch]);

  const handleShowModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return (
    <Suspense fallback={<Loading />}>
      <IonApp>
        {busy ? (
          <Loading />
        ) : (
          <IonReactRouter>
            {currentUser.logged_in ? (
              <IonSplitPane contentId="main">
                <SideMenu />

                <IonContent fullscreen id="main" style={{ maxWidth: 800 }}>
                  <IonFab vertical="bottom" horizontal="center">
                    {showFabButton && (
                      <IonFabButton onClick={handleShowModal}>
                        <IonIcon icon={add} size="large" />
                      </IonFabButton>
                    )}
                    <CreateModal
                      isOpen={showCreateModal}
                      handleCloseModal={handleCloseModal}
                    />
                  </IonFab>

                  <BottomTabbar />
                </IonContent>

                <IonContent id="right-side" fullscreen>
                  <IonList className="ads">
                    <IonTitle>Có thể bạn chưa biết</IonTitle>
                  </IonList>
                </IonContent>
              </IonSplitPane>
            ) : (
              <Routing />
            )}
          </IonReactRouter>
        )}
      </IonApp>
    </Suspense>
  );
};

export default App;
