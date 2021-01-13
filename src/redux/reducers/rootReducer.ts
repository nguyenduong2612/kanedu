import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import {coursesReducer} from './coursesReducer';

const rootReducer = combineReducers({
  user: userReducer,
  courses: coursesReducer
});

export default rootReducer