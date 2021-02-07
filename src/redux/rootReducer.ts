import { combineReducers } from 'redux';
import { coursesReducer } from './courses/courses.reducer';
import { postReducer } from './post/post.reducer';
import { userReducer } from './user/user.reducer';

const rootReducer = combineReducers({
  user: userReducer,
  courses: coursesReducer,
  posts: postReducer
});

export default rootReducer