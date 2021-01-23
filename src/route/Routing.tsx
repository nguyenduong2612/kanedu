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
import Register from "../pages/register/Register";
import Search from "../pages/search/Search";

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
      <Route path="/account" component={Account} exact />
      <Route path="/change-password" component={ChangePassword} exact />
      <Route path="/community" component={Community} exact />
      <Route path="/community/:post_id" component={PostDetail} exact />
      <Route path="/dict" component={Dict} exact />
      <Route path="/jlpt" component={Level} exact />
      <Route path="/jlpt/:id" component={JlptExam} exact />
      <Route path="/home" component={Home} exact />
      <Route path="/home/my-courses" component={MyCourse} exact />
      <Route path="/users/:uid" component={UserProfile} exact />
      <Route
        path="/home/following-courses"
        component={MyFollowingCourse}
        exact
      />
      <Route path="/welcome" component={LandingPage} exact />
    </IonRouterOutlet>
  );
};

export default Routing;