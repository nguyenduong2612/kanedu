import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { coursesReducer } from './coursesReducer';
import { postsReducer } from './postsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  courses: coursesReducer,
  posts: postsReducer
});

export default rootReducer