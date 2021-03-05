import * as firebase from "firebase/app";
import { database } from "../../config/firebaseConfig";
import { fetchUserAvatar } from "../../helpers/firebaseHelper";
import { store } from "../store";
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
} from "./post.types";

export const getPosts = (userId: string) => {
  const getPostsStarted = () => ({
    type: GET_POSTS_STARTED,
  });

  const getPostsSuccess = (posts: Array<any>) => ({
    type: GET_POSTS_SUCCESS,
    payload: [...posts],
  });

  const getPostsFailed = () => ({
    type: GET_POSTS_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(getPostsStarted);
    try {
      const snap = await database
        .collection("posts")
        .orderBy("created_at", "desc")
        .get();

      const favoritedPostSnap = await database
        .collection("users")
        .doc(userId)
        .get();
      let favoritedPost = favoritedPostSnap.data()?.favorite_posts;

      const posts = Promise.all(
        snap.docs.map(async (post) => ({
          id: post.id,
          avatar: await fetchUserAvatar(post.data().author_id),
          isFavorited: favoritedPost
            ? favoritedPost.includes(post.id)
            ? true
            : false
            : false,
          ...post.data(),
        }))
      );
      dispatch(getPostsSuccess(await posts));
    } catch (error) {
      dispatch(getPostsFailed);
    }
  };
};

export const savePost = (post: any, userId: string) => {
  const savePostStarted = () => ({
    type: SAVE_POST_STARTED,
  });

  const savePostSuccess = (post: any) => ({
    type: SAVE_POST_SUCCESS,
    payload: post,
  });

  const savePostFailed = () => ({
    type: SAVE_POST_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(savePostStarted);
    try {
      const res = await database.collection("posts").add(post);
      // if (await algoliaUpdatePost(post, res.id)) console.log("add algolia ok");

      const userRef = database.collection("users").doc(userId);
      userRef.update({
        created_posts: firebase.firestore.FieldValue.arrayUnion(res.id),
      });
      dispatch(savePostSuccess(post));
      window.location.reload();
    } catch (error) {
      dispatch(savePostFailed);
    }
  };
};

export const likePost = (posts: any, postId: string, userId: string) => {
  const likePostStarted = () => ({
    type: LIKE_POST_STARTED,
  });

  const likePostSuccess = (postIndex: number) => ({
    type: LIKE_POST_SUCCESS,
    payload: postIndex,
  });

  const likePostFailed = () => ({
    type: LIKE_POST_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(likePostStarted);
    try {
      let userRef = database.collection("users").doc(userId);
      userRef.update({
        favorite_posts: firebase.firestore.FieldValue.arrayUnion(postId),
      });

      let postRef = database.collection("posts").doc(postId);
      postRef.update({
        likes: firebase.firestore.FieldValue.increment(1),
      });

      let postIndex = posts.findIndex((post: any) => post.id === postId);
      dispatch(likePostSuccess(postIndex));
    } catch (error) {
      dispatch(likePostFailed);
    }
  };
};

export const unlikePost = (posts: any, postId: string, userId: string) => {
  const unlikePostStarted = () => ({
    type: UNLIKE_POST_STARTED,
  });

  const unlikePostSuccess = (postIndex: number) => ({
    type: UNLIKE_POST_SUCCESS,
    payload: postIndex,
  });

  const unlikePostFailed = () => ({
    type: UNLIKE_POST_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(unlikePostStarted);
    try {
      let userRef = database.collection("users").doc(userId);
      userRef.update({
        favorite_posts: firebase.firestore.FieldValue.arrayRemove(postId),
      });

      let postRef = database.collection("posts").doc(postId);
      postRef.update({
        likes: firebase.firestore.FieldValue.increment(-1),
      });

      let postIndex = posts.findIndex((post: any) => post.id === postId);
      dispatch(unlikePostSuccess(postIndex));
    } catch (error) {
      dispatch(unlikePostFailed);
    }
  };
};

export const getComments = (postId: string) => {
  const getCommentsStarted = () => ({
    type: GET_COMMENTS_STARTED,
  });

  const getCommentsSuccess = (comments: any) => ({
    type: GET_COMMENTS_SUCCESS,
    payload: comments,
  });

  const getCommentsFailed = () => ({
    type: GET_COMMENTS_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(getCommentsStarted);
    try {
      const snap = await database
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("created_at")
        .get();

      const comments = Promise.all(
        snap.docs.map(async (cmt) => ({
          id: cmt.id,
          ...cmt.data(),
        }))
      );
      dispatch(getCommentsSuccess(await comments));
    } catch (error) {
      dispatch(getCommentsFailed);
    }
  };
};

export const saveComment = (
  author: string,
  content: string,
  postId: string,
  posts: any
) => {
  const saveCommentStarted = () => ({
    type: SAVE_COMMENT_STARTED,
  });

  const saveCommentSuccess = (comment: any, postIndex: number) => ({
    type: SAVE_COMMENT_SUCCESS,
    payload: comment,
    index: postIndex,
  });

  const saveCommentFailed = () => ({
    type: SAVE_COMMENT_FAILED,
  });

  return async (dispatch: typeof store.dispatch) => {
    dispatch(saveCommentStarted);
    try {
      let comment = {
        author,
        content,
        created_at: Date.now(),
      };

      await database
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add(comment);

      let postRef = database.collection("posts").doc(postId);
      postRef.update({
        comments: firebase.firestore.FieldValue.increment(1),
      });

      let postIndex = posts.findIndex((post: any) => post.id === postId);
      dispatch(saveCommentSuccess(comment, postIndex));
    } catch (error) {
      dispatch(saveCommentFailed);
    }
  };
};

export const clearComments = () => ({
  type: CLEAR_COMMENTS,
});
