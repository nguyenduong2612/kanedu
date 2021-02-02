import { algoliaClient } from "../config/algoliaConfig";

const coursesIndex = algoliaClient.initIndex(`courses`);
const postsIndex = algoliaClient.initIndex(`posts`);
const usersIndex = algoliaClient.initIndex(`users`);

export async function algoliaUpdateCourse(course: any, objectID: string) {
  try {
    await coursesIndex.saveObject(Object.assign({}, { objectID }, course))
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function algoliaUpdatePost(post: any, objectID: string) {
  try {
    await postsIndex.saveObject(Object.assign({}, { objectID }, post))
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function algoliaUpdateUser(user: any, objectID: string) {
  try {
    await usersIndex.saveObject(Object.assign({}, { objectID }, user))
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}