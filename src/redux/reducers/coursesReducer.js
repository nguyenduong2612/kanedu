const initialState = {
  courses: []
}

export function setCourse(course) {
  return {
    type: "SET_COURSE",
    payload: course
  }
}

export function coursesReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_COURSE": 
      return {
        courses: [...state.courses, action.payload]
      }
    default:
      return state
  }
}