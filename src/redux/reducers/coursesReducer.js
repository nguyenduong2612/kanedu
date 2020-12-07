const initialState = {
  courses: [],
  my_courses: [],
};

export function setFollowingCourses(course) {
  return {
    type: "SET_FOLLOWING_COURSES",
    payload: course,
  };
}

export function removeFollowingCourses(course_index) {
  return {
    type: "REMOVE_FOLLOWING_COURSES",
    payload: course_index,
  };
}

export function setMyCourses(course) {
  return {
    type: "SET_MY_COURSES",
    payload: course,
  };
}

export function coursesReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_FOLLOWING_COURSES":
      return {
        ...state,
        courses: [...state.courses, action.payload],
      };
    case "REMOVE_FOLLOWING_COURSES":
      return {
        ...state,
        courses: [
          ...state.courses.slice(0, action.payload),
          ...state.courses.slice(action.payload + 1),
        ],
      };
    case "SET_MY_COURSES":
      return {
        ...state,
        my_courses: [...state.my_courses, action.payload],
      };
    default:
      return state;
  }
}
