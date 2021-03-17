import { combineReducers } from "redux";
import { coursesReducer } from "./courses/courses.reducer";
import { postReducer } from "./post/post.reducer";
import { userReducer } from "./user/user.reducer";

const appReducer = combineReducers({
  user: userReducer,
  courses: coursesReducer,
  posts: postReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_DATA") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
