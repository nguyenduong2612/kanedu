import React, { useEffect, useState, lazy, Suspense } from "react";
import { Redirect, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonLoading,
  IonSplitPane,
  IonFab,
  IonFabButton,
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";
import { RefresherEventDetail } from "@ionic/core";
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

/* Ionic icons */
import {
  peopleOutline,
  peopleSharp,
  personOutline,
  personSharp,
  homeOutline,
  homeSharp,
  searchOutline,
  searchSharp,
  add,
} from "ionicons/icons";

import { database, getCurrentUser } from "./config/firebaseConfig";
import { setCurrentUser } from "./redux/reducers/userReducer";

/* Pages and components */
const SideMenu = lazy(() => import("./components/sidemenu/SideMenu"));
const CreateModal = lazy(() => import("./components/create/CreateModal"));
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Course = lazy(() => import("./pages/course/Course"));
const Lesson = lazy(() => import("./pages/lesson/Lesson"));
const CreateCourse = lazy(() => import("./pages/create/CreateCourse"));
const CreateLesson = lazy(() => import("./pages/create/CreateLesson"));
const Learning = lazy(() => import("./pages/lesson/Learning"));
const Testing = lazy(() => import("./pages/lesson/Testing"));
const Community = lazy(() => import("./pages/community/Community"));
const Search = lazy(() => import("./pages/search/Search"));

const Routing: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
      <Route path="/login" component={Login} exact />
      <Route path="/courses/:id" component={Course} exact />
      <Route path="/courses/:course_id/:lesson_id" component={Lesson} exact />
      <Route
        path="/courses/:course_id/:lesson_id/study"
        component={Learning}
        exact
      />
      <Route
        path="/courses/:course_id/:lesson_id/test"
        component={Testing}
        exact
      />
      <Route path="/create/course" component={CreateCourse} exact />
      <Route path="/create/lesson" component={CreateLesson} exact />
      <Route path="/register" component={Register} exact />
      <Route path="/settings" component={Settings} exact />
      <Route path="/search" component={Search} exact />
      <Route path="/profile" render={() => <Profile />} exact />
      <Route path="/community" render={() => <Community />} exact />
      <Route path="/home" render={() => <Home />} exact />
    </IonRouterOutlet>
  );
};

const Loading: React.FC = () => {
  return <IonLoading message="Please wait" duration={0} isOpen={true} />;
};

interface RootState {
  user: any;
  logged_in: boolean;
}

const App: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(getPlatforms());
    getCurrentUser().then(async (user: any) => {
      //console.log(user)
      if (user) {
        //window.history.replaceState({}, '', '/')
        const ref = database
          .collection("users")
          .where("uid", "==", user.uid)
          .limit(1);
        const docs = await ref.get();
        if (docs.empty) {
          console.log("No such document!");
        } else {
          docs.forEach((doc) => {
            let currentUser = {
              uid: user.uid,
              email: user.email,
              name: doc.data().name,
              birthday: doc.data().birthday,
              profileURL: doc.data().profileURL,
              verified: user.emailVerified,
            };
            dispatch(setCurrentUser(currentUser));
          });
        }
      } else {
        window.history.replaceState({}, "", "/login");
      }
      setBusy(false);
    });
  }, [dispatch]);

  async function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    window.location.reload();
    event.detail.complete();
  }

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

                <IonContent fullscreen id="main">
                  <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                  </IonRefresher>
                  <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={handleShowModal}>
                      <IonIcon icon={add} size="large" />
                    </IonFabButton>
                    <CreateModal
                      isOpen={showCreateModal}
                      handleCloseModal={handleCloseModal}
                    />
                  </IonFab>

                  <IonTabs>
                    <IonRouterOutlet>
                      <Routing />
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom" id="appTabBar">
                      <IonTabButton tab="home" href="/home">
                        <IonIcon ios={homeOutline} md={homeSharp} />
                        <IonLabel>Trang chủ</IonLabel>
                      </IonTabButton>
                      <IonTabButton tab="search" href="/search">
                        <IonIcon ios={searchOutline} md={searchSharp} />
                        <IonLabel>Tìm kiếm</IonLabel>
                      </IonTabButton>
                      <IonTabButton disabled></IonTabButton>
                      <IonTabButton tab="community" href="/community">
                        <IonIcon ios={peopleOutline} md={peopleSharp} />
                        <IonLabel>Cộng đồng</IonLabel>
                      </IonTabButton>
                      <IonTabButton tab="profile" href="/profile">
                        <IonIcon ios={personOutline} md={personSharp} />
                        <IonLabel>Tài khoản</IonLabel>
                      </IonTabButton>
                    </IonTabBar>
                  </IonTabs>
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
