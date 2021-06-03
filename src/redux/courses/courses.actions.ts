import firebase from "firebase/app";
import { database } from "../../config/firebaseConfig";
import { createVector } from "../../helpers/recommenderHelper";
import { Course } from "../../models";
import { store } from "../store";
import {
  GET_COURSES_FAILED,
  GET_COURSES_STARTED,
  GET_COURSES_SUCCESS,
  FOLLOW_COURSE_STARTED,
  FOLLOW_COURSE_SUCCESS,
  FOLLOW_COURSE_FAILED,
  UNFOLLOW_COURSE_FAILED,
  UNFOLLOW_COURSE_STARTED,
  UNFOLLOW_COURSE_SUCCESS,
  CREATE_COURSE_FAILED,
  CREATE_COURSE_STARTED,
  CREATE_COURSE_SUCCESS,
  DELETE_COURSE_FAILED,
  DELETE_COURSE_STARTED,
  DELETE_COURSE_SUCCESS,
} from "./courses.types";

export const getCourses = (userId: string) => {
  const getCoursesStarted = () => ({
    type: GET_COURSES_STARTED,
  });

  const getCoursesSuccess = (courseData: any) => ({
    type: GET_COURSES_SUCCESS,
    payload: courseData,
  });

  const getCoursesFailed = () => ({
    type: GET_COURSES_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(getCoursesStarted);
    try {
      const snap = await database.collection("courses").get();

      if (!snap.empty) {
        const courses = await Promise.all(
          snap.docs.map(async (course) => ({
            id: course.id,
            ...course.data(),
          }))
        );

        const followingCourses = courses.filter((course: any) =>
          course.followed_by.includes(userId)
        );
        const createdCourses = courses.filter(
          (course: any) => course.author_id === userId
        );

        let courseData = {
          courses,
          followingCourses,
          createdCourses,
        };

        dispatch(getCoursesSuccess(courseData));
      }
    } catch (error) {
      dispatch(getCoursesFailed);
    }
  };
};

export const followCourse = (courseId: string, userId: string) => {
  const followCourseStarted = () => ({
    type: FOLLOW_COURSE_STARTED,
  });

  const followCourseSuccess = (course: any) => ({
    type: FOLLOW_COURSE_SUCCESS,
    payload: course,
  });

  const followCourseFailed = () => ({
    type: FOLLOW_COURSE_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(followCourseStarted);
    try {
      let ref = database.collection("courses").doc(courseId);
      ref.update({
        followed_by: firebase.firestore.FieldValue.arrayUnion(userId),
      });

      let userRef = database.collection("users").doc(userId);
      userRef.update({
        following_courses: firebase.firestore.FieldValue.arrayUnion(courseId),
      });

      const snap = await database.collection("courses").doc(courseId).get();

      const course = {
        id: snap.id,
        ...snap.data(),
      };

      dispatch(followCourseSuccess(course));
    } catch (error) {
      dispatch(followCourseFailed);
    }
  };
};

export const unfollowCourse = (
  followingCourses: any,
  courseId: string,
  userId: string
) => {
  const unfollowCourseStarted = () => ({
    type: UNFOLLOW_COURSE_STARTED,
  });

  const unfollowCourseSuccess = (courseIndex: number) => ({
    type: UNFOLLOW_COURSE_SUCCESS,
    payload: courseIndex,
  });

  const unfollowCourseFailed = () => ({
    type: UNFOLLOW_COURSE_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(unfollowCourseStarted);
    try {
      let ref = database.collection("courses").doc(courseId);
      ref.update({
        followed_by: firebase.firestore.FieldValue.arrayRemove(userId),
      });

      let userRef = database.collection("users").doc(userId);
      userRef.update({
        following_courses: firebase.firestore.FieldValue.arrayRemove(courseId),
      });

      let courseIndex = followingCourses.findIndex(
        (course: any) => course.id === courseId
      );

      dispatch(unfollowCourseSuccess(courseIndex));
    } catch (error) {
      dispatch(unfollowCourseFailed);
    }
  };
};

export const createCourse = (courseData: any, userId: string) => {
  const createCourseStarted = () => ({
    type: CREATE_COURSE_STARTED,
  });

  const createCourseSuccess = (course: Course) => ({
    type: CREATE_COURSE_SUCCESS,
    payload: course,
  });

  const createCourseFailed = () => ({
    type: CREATE_COURSE_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(createCourseStarted);
    try {
      courseData.vector = createVector(courseData);
      const res = await database.collection("courses").add(courseData);

      const userRef = database.collection("users").doc(userId);
      userRef.update({
        created_courses: firebase.firestore.FieldValue.arrayUnion(res.id),
      });

      let newCourse = {
        id: res.id,
        ...courseData,
      };

      dispatch(createCourseSuccess(newCourse));
    } catch (error) {
      dispatch(createCourseFailed);
    }
  };
};

export const deleteCourse = (
  createdCourse: any,
  courseId: string,
  userId: string
) => {
  const deleteCourseStarted = () => ({
    type: DELETE_COURSE_STARTED,
  });

  const deleteCourseSuccess = (courseIndex: number) => ({
    type: DELETE_COURSE_SUCCESS,
    payload: courseIndex,
  });

  const deleteCourseFailed = () => ({
    type: DELETE_COURSE_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(deleteCourseStarted);
    try {
      await database.collection("courses").doc(courseId).delete();

      // if (await algoliaDeleteCourse(courseId))
      //   console.log("delete algolia ok");

      let userRef = database.collection("users").doc(userId);
      userRef.update({
        created_courses: firebase.firestore.FieldValue.arrayRemove(courseId),
      });

      let courseIndex = createdCourse.findIndex(
        (course: any) => course.id === courseId
      );

      dispatch(deleteCourseSuccess(courseIndex));
    } catch (error) {
      dispatch(deleteCourseFailed);
    }
  };
};
