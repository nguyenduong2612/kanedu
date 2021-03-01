import {
  SET_CURRENT_USER_STARTED,
  SET_CURRENT_USER_SUCCESS,
  SET_CURRENT_USER_FAILED,
  SIGN_OUT_USER_SUCCESS,
  UPDATE_CARD_STATUS_SUCCESS,
  SET_CARD_STATUS_SUCCESS,
} from "./user.types";

const initialState = {
  user: "",
  isLoading: false,
  isLoggedin: false,
};

export const userReducer = (state = initialState, action: any) => {
  let newState: any = { ...state };
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

    case UPDATE_CARD_STATUS_SUCCESS:
      newState.user.cardStatus[action.payload].status = action.status;
      return newState;
    case SET_CARD_STATUS_SUCCESS:
      newState.user.cardStatus.push(action.payload);
      return newState;
    default:
      return state;
  }
};
