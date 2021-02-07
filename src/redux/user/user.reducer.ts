import {
  SET_CURRENT_USER_STARTED,
  SET_CURRENT_USER_SUCCESS,
  SET_CURRENT_USER_FAILED,
  SIGN_OUT_USER_SUCCESS,
} from "./user.types";

const initialState = {
  user: "",
  isLoading: false,
  isLoggedin: false,
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CURRENT_USER_STARTED:
      return {
        ...state,
        isLoading: true,
        isLoggedin: false,
      };
    case SET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isLoggedin: true,
      };
    case SET_CURRENT_USER_FAILED:
    case SIGN_OUT_USER_SUCCESS:
      return {
        ...state,
        user: "",
        isLoading: false,
        isLoggedin: false,
      };
    default:
      return state;
  }
};
