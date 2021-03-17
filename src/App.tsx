import React, { useEffect, useState, Suspense } from "react";
import { useDispatch } from "react-redux";
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

import SideMenu from "./components/sidemenu/SideMenu";
import CreateModal from "./components/modals/CreateModal";
import BottomTabbar from "./components/tabbars/BottomTabbar";

// hooks
import useCurrentUser from "./hooks/useCurrentUser";
import {
  getCreatedCourses,
  getFollowingCourses,
} from "./redux/courses/courses.actions";
import { getPosts } from "./redux/post/post.actions";

// Capacitor plugins
const { StatusBar, Keyboard } = Plugins;

const Loading: React.FC = () => {
  return <IonLoading message="Vui lòng đợi" duration={0} isOpen={true} />;
};

const App: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showFabButton, setShowFabButton] = useState<boolean>(true);
  const dispatch = useDispatch();

  const { user, isLoggedin, isLoading } = useCurrentUser();
  // useFavoritePosts();

  useEffect(() => {
    if (user.uid) {
      dispatch(getCreatedCourses(user.uid));
      dispatch(getFollowingCourses(user.uid));
      dispatch(getPosts(user.uid));
    }
  }, [dispatch, user.uid]);

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

    changeStatusBar();
    toggleFabButton();
  }, [dispatch]);

  const handleShowModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return (
    <Suspense fallback={<Loading />}>
      <IonApp>
        {isLoading ? (
          <Loading />
        ) : (
          <IonReactRouter>
            <IonSplitPane contentId="main">
              <SideMenu />

              <IonContent fullscreen id="main">
                {isLoggedin && (
                  <IonFab vertical="bottom" horizontal="center">
                    {showFabButton && (
                      <IonFabButton onClick={handleShowModal} id="appFabBtn">
                        <IonIcon icon={add} size="large" />
                      </IonFabButton>
                    )}
                    <CreateModal
                      isOpen={showCreateModal}
                      handleCloseModal={handleCloseModal}
                    />
                  </IonFab>
                )}

                <BottomTabbar />
              </IonContent>

              <IonContent id="right-side" fullscreen >
                <IonList className="ads">
                  <IonTitle>Có thể bạn chưa biết</IonTitle>
                </IonList>
              </IonContent>
            </IonSplitPane>
          </IonReactRouter>
        )}
      </IonApp>
    </Suspense>
  );
};

export default App;
