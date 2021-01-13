const initialState = {
  user: {
    uid: '',
    email: '',
    name: '',
    birthday: '',
    profileURL: '',
    verified: false
  },
  logged_in: false,
}

export function setCurrentUser(user: any) {
  return {
    type: "SET_CURRENT_USER",
    payload: user
  }
}

export function userReducer(state = initialState, action: any) {
  switch (action.type) {
    case "SET_CURRENT_USER": 
      return {
        ...state,
        user: action.payload,
        logged_in: true
      }
    default:
      return state
  }
}