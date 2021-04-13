import React, { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { IonApp, IonContent, IonLoading, IonSplitPane } from "@ionic/react";

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

import SideMenu from "./components/sidemenu/SideMenu";
import BottomTabbar from "./components/tabbars/BottomTabbar";

// hooks
import useCurrentUser from "./hooks/useCurrentUser";
import { getCourses } from "./redux/courses/courses.actions";
import { getPosts } from "./redux/post/post.actions";

// Capacitor plugins
const { StatusBar } = Plugins;

const Loading: React.FC = () => {
  return <IonLoading message="Vui lòng đợi" duration={0} isOpen={true} />;
};

const App: React.FC = () => {
  const dispatch = useDispatch();

  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (user.uid) {
      dispatch(getCourses(user.uid));
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

    changeStatusBar();
  }, [dispatch]);

  return (
    <Suspense fallback={<Loading />}>
      <IonApp>
        {isLoading ? (
          <>
            <Loading />
            <IonContent fullscreen id="main"></IonContent>
          </>
        ) : (
          <IonReactRouter>
            <IonSplitPane contentId="main" id="splitpane">
              <SideMenu />

              <IonContent fullscreen id="main">
                <BottomTabbar />
              </IonContent>
            </IonSplitPane>
          </IonReactRouter>
        )}
      </IonApp>
    </Suspense>
  );
};

export default App;
