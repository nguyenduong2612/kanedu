import firebase from "firebase/app";
import { database } from "../../config/firebaseConfig";
import { store } from "../store";
import {
  GET_CREATED_COURSES_STARTED,
  GET_CREATED_COURSES_SUCCESS,
  GET_CREATED_COURSES_FAILED,
  GET_FOLLOWING_COURSES_FAILED,
  GET_FOLLOWING_COURSES_STARTED,
  GET_FOLLOWING_COURSES_SUCCESS,
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

export const getCreatedCourses = (userId: string) => {
  const getCreatedCoursesStarted = () => ({
    type: GET_CREATED_COURSES_STARTED,
  });

  const getCreatedCoursesSuccess = (createdCourses: Array<any>) => ({
    type: GET_CREATED_COURSES_SUCCESS,
    payload: [...createdCourses],
  });

  const getCreatedCoursesFailed = () => ({
    type: GET_CREATED_COURSES_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(getCreatedCoursesStarted);
    try {
      const snap = await database
        .collection("courses")
        .where("author_id", "==", userId)
        .get();

      if (snap.empty) {
        console.log("You haven't created any courses yet");
      } else {
        const createdCourses = Promise.all(
          snap.docs.map(async (course) => ({
            id: course.id,
            ...course.data(),
          }))
        );
        dispatch(getCreatedCoursesSuccess(await createdCourses));
      }
    } catch (error) {
      dispatch(getCreatedCoursesFailed);
    }
  };
};

export const getFollowingCourses = (userId: string) => {
  const getFollowingCoursesStarted = () => ({
    type: GET_FOLLOWING_COURSES_STARTED,
  });

  const getFollowingCoursesSuccess = (createdCourses: Array<any>) => ({
    type: GET_FOLLOWING_COURSES_SUCCESS,
    payload: [...createdCourses],
  });

  const getFollowingCoursesFailed = () => ({
    type: GET_FOLLOWING_COURSES_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(getFollowingCoursesStarted);
    try {
      const snap = await database
        .collection("courses")
        .where("followed_by", "array-contains", userId)
        .get();

      if (snap.empty) {
        console.log("You haven't followed any courses yet");
      } else {
        const followingCourses = Promise.all(
          snap.docs.map(async (course) => ({
            id: course.id,
            ...course.data(),
          }))
        );
        dispatch(getFollowingCoursesSuccess(await followingCourses));
      }
    } catch (error) {
      dispatch(getFollowingCoursesFailed);
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

export const createCourse = (course: any, userId: string) => {
  const createCourseStarted = () => ({
    type: CREATE_COURSE_STARTED,
  });

  const createCourseSuccess = (courseIndex: number) => ({
    type: CREATE_COURSE_SUCCESS,
    payload: courseIndex,
  });

  const createCourseFailed = () => ({
    type: CREATE_COURSE_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(createCourseStarted);
    try {
      const res = await database.collection("courses").add(course);
      // if (await algoliaUpdateCourse(course, res.id))
      //   console.log("add algolia ok");

      const userRef = database.collection("users").doc(userId);
      userRef.update({
        created_courses: firebase.firestore.FieldValue.arrayUnion(res.id),
      });

      course.id = res.id;
      dispatch(createCourseSuccess(course));
    } catch (error) {
      dispatch(createCourseFailed);
    }
  };
};

export const deleteCourse = (createdCourse: any, courseId: string, userId: string) => {
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
