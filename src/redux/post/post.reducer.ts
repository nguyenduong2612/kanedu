import {
  GET_POSTS_STARTED,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAILED,
  SAVE_POST_FAILED,
  SAVE_POST_STARTED,
  SAVE_POST_SUCCESS,
  LIKE_POST_FAILED,
  LIKE_POST_STARTED,
  LIKE_POST_SUCCESS,
  UNLIKE_POST_FAILED,
  UNLIKE_POST_STARTED,
  UNLIKE_POST_SUCCESS,
  GET_COMMENTS_FAILED,
  GET_COMMENTS_STARTED,
  GET_COMMENTS_SUCCESS,
  CLEAR_COMMENTS,
  SAVE_COMMENT_FAILED,
  SAVE_COMMENT_STARTED,
  SAVE_COMMENT_SUCCESS,
  DELETE_POST_FAILED,
  DELETE_POST_STARTED,
  DELETE_POST_SUCCESS,
} from "./post.types";

const initialState = {
  posts: [],
  comments: [],
  isLoading: false,
};

export const postReducer = (state = initialState, action: any) => {
  let newState: any = { ...state };
  switch (action.type) {
    case GET_POSTS_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.payload,
        isLoading: false,
      };
    case GET_POSTS_FAILED:
      return {
        ...state,
        posts: [],
        isLoading: false,
      };

    case SAVE_POST_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case SAVE_POST_SUCCESS:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        isLoading: false,
      };
    case SAVE_POST_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case DELETE_POST_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        posts: [
          ...state.posts.slice(0, action.payload),
          ...state.posts.slice(action.payload + 1),
        ],
        isLoading: false,
      };
    case DELETE_POST_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case LIKE_POST_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case LIKE_POST_SUCCESS:
      newState.posts[action.payload].isFavorited = true;
      newState.posts[action.payload].likes =
        newState.posts[action.payload].likes + 1;
      return newState;
    case LIKE_POST_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case UNLIKE_POST_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case UNLIKE_POST_SUCCESS:
      newState.posts[action.payload].isFavorited = false;
      newState.posts[action.payload].likes =
        newState.posts[action.payload].likes - 1;
      return newState;
    case UNLIKE_POST_FAILED:
      return {
        ...state,
        isLoading: false,
      };

    case GET_COMMENTS_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case GET_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: action.payload,
        isLoading: false,
      };
    case GET_COMMENTS_FAILED:
    case CLEAR_COMMENTS:
      return {
        ...state,
        comments: [],
        isLoading: false,
      };

    case SAVE_COMMENT_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case SAVE_COMMENT_SUCCESS:
      newState.comments.push(action.payload);
      newState.posts[action.index].comments =
        newState.posts[action.index].comments + 1;
      return newState;
    case SAVE_COMMENT_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
