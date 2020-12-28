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
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonLoading,
  IonSplitPane,
  IonFab,
  IonFabButton,
  IonTitle,
  IonList,
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";
import { RefresherEventDetail } from "@ionic/core";
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
import {
  peopleOutline,
  personOutline,
  homeOutline,
  searchOutline,
  add,
  home,
  people,
  person,
  search,
} from "ionicons/icons";

import { database, getCurrentUser } from "./config/firebaseConfig";
import { setCurrentUser } from "./redux/reducers/userReducer";
import LandingPage from "./pages/LandingPage";

/* Pages and components */
const SideMenu = lazy(() => import("./components/sidemenu/SideMenu"));
const CreateModal = lazy(() => import("./components/create/CreateModal"));
const Home = lazy(() => import("./pages/home/Home"));
const MyCourse = lazy(() => import("./pages/home/my_courses/MyCourse"));
const MyFollowingCourse = lazy(
  () => import("./pages/home/following/MyFollowingCourse")
);
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const ChangePassword = lazy(() => import("./pages/profile/ChangePassword"));
const Course = lazy(() => import("./pages/course/Course"));
const Lesson = lazy(() => import("./pages/lesson/Lesson"));
const CreateCourse = lazy(() => import("./pages/create/CreateCourse"));
const CreateLesson = lazy(() => import("./pages/create/CreateLesson"));
const CreateCard = lazy(() => import("./pages/create/CreateCard"));
const Learning = lazy(() => import("./pages/lesson/Learning"));
const Testing = lazy(() => import("./pages/lesson/Testing"));
const Community = lazy(() => import("./pages/community/Community"));
const PostDetail = lazy(() => import("./pages/community/post/PostDetail"));
const Search = lazy(() => import("./pages/search/Search"));
const Dict = lazy(() => import("./pages/dict/Dict"));
const Test = lazy(() => import("./pages/test/Test"));

// Capacitor plugins
const { StatusBar, Keyboard } = Plugins;

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
      <Route path="/course/create" component={CreateCourse} exact />
      <Route path="/lesson/create" component={CreateLesson} exact />
      <Route path="/lesson/create/:course_id" component={CreateCard} exact />
      <Route path="/register" component={Register} exact />
      <Route path="/settings" component={Settings} exact />
      <Route path="/search" component={Search} exact />
      <Route path="/profile" component={Profile} exact />
      <Route path="/profile/change-password" component={ChangePassword} exact />
      <Route path="/community" component={Community} exact />
      <Route path="/community/:post_id" component={PostDetail} exact />
      <Route path="/dict" component={Dict} exact />
      <Route path="/test" component={Test} exact />
      <Route path="/home" component={Home} exact />
      <Route path="/home/my-courses" component={MyCourse} exact />
      <Route
        path="/home/following-courses"
        component={MyFollowingCourse}
        exact
      />
      <Route path="/welcome" component={LandingPage} exact />
    </IonRouterOutlet>
  );
};

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
        window.history.replaceState({}, "", "/welcome");
      }
      setBusy(false);
    });

    changeStatusBar();
    toggleFabButton();
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

                <IonContent fullscreen id="main" style={{ maxWidth: 800 }}>
                  <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                  </IonRefresher>
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

                  <IonTabs>
                    <IonRouterOutlet>
                      <Routing />
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom" id="appTabBar">
                      <IonTabButton tab="home" href="/home">
                        <IonIcon ios={homeOutline} md={home} />
                        {/* <IonLabel>Trang chủ</IonLabel> */}
                      </IonTabButton>
                      <IonTabButton tab="search" href="/search">
                        <IonIcon ios={searchOutline} md={search} />
                        {/* <IonLabel>Tìm kiếm</IonLabel> */}
                      </IonTabButton>
                      <IonTabButton disabled></IonTabButton>
                      <IonTabButton tab="community" href="/community">
                        <IonIcon ios={peopleOutline} md={people} />
                        {/* <IonLabel>Cộng đồng</IonLabel> */}
                      </IonTabButton>
                      <IonTabButton tab="profile" href="/profile">
                        <IonIcon ios={personOutline} md={person} />
                        {/* <IonLabel>Tài khoản</IonLabel> */}
                      </IonTabButton>
                    </IonTabBar>
                  </IonTabs>
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
