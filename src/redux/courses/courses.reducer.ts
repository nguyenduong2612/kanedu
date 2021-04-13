import {
  GET_COURSES_FAILED,
  GET_COURSES_STARTED,
  GET_COURSES_SUCCESS,
  FOLLOW_COURSE_FAILED,
  FOLLOW_COURSE_STARTED,
  FOLLOW_COURSE_SUCCESS,
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

const initialState = {
  courses: [],
  createdCourses: [],
  followingCourses: [],
  isLoading: false,
};

export const coursesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_COURSES_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case GET_COURSES_SUCCESS:
      return {
        ...state,
        courses: action.payload.courses,
        createdCourses: action.payload.createdCourses,
        followingCourses: action.payload.followingCourses,
        isLoading: false,
      };
    case GET_COURSES_FAILED:
      return {
        ...state,
        courses: [],
        createdCourses: [],
        followingCourses: [],
        isLoading: false,
      };

    case FOLLOW_COURSE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case FOLLOW_COURSE_SUCCESS:
      return {
        ...state,
        followingCourses: [action.payload, ...state.followingCourses],
        isLoading: false,
      };
    case FOLLOW_COURSE_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case UNFOLLOW_COURSE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case UNFOLLOW_COURSE_SUCCESS:
      return {
        ...state,
        followingCourses: [
          ...state.followingCourses.slice(0, action.payload),
          ...state.followingCourses.slice(action.payload + 1),
        ],
        isLoading: false,
      };
    case UNFOLLOW_COURSE_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case CREATE_COURSE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case CREATE_COURSE_SUCCESS:
      return {
        ...state,
        courses: [action.payload, ...state.courses],
        createdCourses: [action.payload, ...state.createdCourses],
        isLoading: false,
      };
    case CREATE_COURSE_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case DELETE_COURSE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_COURSE_SUCCESS:
      return {
        ...state,
        courses: [
          ...state.courses.slice(0, action.payload),
          ...state.courses.slice(action.payload + 1),
        ],
        createdCourses: [
          ...state.createdCourses.slice(0, action.payload),
          ...state.createdCourses.slice(action.payload + 1),
        ],
        isLoading: false,
      };
    case DELETE_COURSE_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};
