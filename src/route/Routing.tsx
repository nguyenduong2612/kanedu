import { IonRouterOutlet } from "@ionic/react";
import React from "react";
import { Route, Redirect } from "react-router";

/* Pages and components */
import Settings from "../pages/settings/Settings";
import Community from "../pages/community/Community";
import PostDetail from "../pages/community/post/PostDetail";
import Course from "../pages/course/Course";
import CreateCard from "../pages/create/CreateCard";
import CreateCourse from "../pages/create/CreateCourse";
import CreateLesson from "../pages/create/CreateLesson";
import Dict from "../pages/dict/Dict";
import MyFollowingCourse from "../pages/home/following/MyFollowingCourse";
import Home from "../pages/home/Home";
import MyCourse from "../pages/home/my_courses/MyCourse";
import JlptExam from "../pages/jlpt/JlptExam";
import Level from "../pages/jlpt/Level";
import LandingPage from "../pages/landing_page/LandingPage";
import Learning from "../pages/lesson/Learning";
import Lesson from "../pages/lesson/Lesson";
import Testing from "../pages/lesson/Testing";
import Login from "../pages/login/Login";
import Account from "../pages/profile/Account";
import ChangePassword from "../pages/profile/ChangePassword";
import UserProfile from "../pages/profile/UserProfile";
import MyProfile from "../pages/profile/MyProfile";
import Register from "../pages/register/Register";
import Search from "../pages/search/Search";
import { useSelector } from "react-redux";
import OCR from "../pages/search/OCR";
import Matching from "../pages/lesson/Matching";
import Ranking from "../pages/ranking/Ranking";
import CourseEdit from "../pages/course/CourseEdit";
import ReminderSetting from "../pages/settings/ReminderSetting";
import Translate from "../pages/translate/Translate";
import GoalSetting from "../pages/settings/GoalSetting";

interface RootState {
  user: any;
}

const Routing: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <>
      {user ? (
        <IonRouterOutlet>
          <Route path="/" render={() => <Redirect to="/home" />} exact />
          <Route path="/login" render={() => <Redirect to="/home" />} exact />
          <Route path="/courses/:id" component={Course} exact />
          <Route path="/courses/:id/edit" component={CourseEdit} exact />
          <Route
            path="/courses/:course_id/lesson/:lesson_id"
            component={Lesson}
            exact
          />
          <Route
            path="/courses/:course_id/lesson/:lesson_id/study"
            component={Learning}
            exact
          />
          <Route
            path="/courses/:course_id/lesson/:lesson_id/test"
            component={Testing}
            exact
          />
          <Route
            path="/courses/:course_id/lesson/:lesson_id/match"
            component={Matching}
            exact
          />
          <Route path="/courses/create" component={CreateCourse} exact />
          <Route path="/courses/choose" component={CreateLesson} exact />
          <Route
            path="/courses/:course_id/lesson/create"
            component={CreateCard}
            exact
          />
          <Route path="/register" render={() => <Redirect to="/home" />} />
          <Route path="/settings" component={Settings} exact />
          <Route path="/settings/reminder" component={ReminderSetting} exact />
          <Route path="/settings/goal" component={GoalSetting} exact />
          <Route path="/search" component={Search} exact />
          <Route
            path="/my-profile/account-settings"
            component={Account}
            exact
          />
          <Route path="/change-password" component={ChangePassword} exact />
          <Route path="/community" component={Community} exact />
          <Route path="/community/:post_id" component={PostDetail} exact />
          <Route path="/dict" component={Dict} exact />
          <Route path="/translate" component={Translate} exact />
          <Route path="/jlpt" component={Level} exact />
          <Route path="/jlpt/:id" component={JlptExam} exact />
          <Route path="/home" component={Home} exact />
          <Route path="/home/my-courses" component={MyCourse} exact />
          <Route path="/my-profile" component={MyProfile} exact />
          <Route path="/users/:uid" component={UserProfile} exact />
          <Route
            path="/home/following-courses"
            component={MyFollowingCourse}
            exact
          />
          <Route path="/welcome" component={LandingPage} exact />
          <Route path="/ocr" component={OCR} exact />
          <Route path="/ranking" component={Ranking} exact />
        </IonRouterOutlet>
      ) : (
        <IonRouterOutlet>
          <Redirect from="*" to="/welcome" />
          <Route
            path="/"
            render={() => <Redirect to="/welcome" />}
            exact
          />
          <Route path="/home" component={Home} exact />
          <Route path="/search" component={Search} exact />
          <Route path="/dict" component={Dict} exact />
          <Route path="/translate" component={Translate} exact />
          <Route path="/welcome" component={LandingPage} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
        </IonRouterOutlet>
      )}
    </>
  );
};

export default Routing;
