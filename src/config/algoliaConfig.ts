import algoliasearch from "algoliasearch";

const client = algoliasearch(
  String(process.env.REACT_APP_ALGOLIA_APP_ID),
  String(process.env.REACT_APP_ALGOLIA_ADMIN_KEY)
);

const coursesIndex = client.initIndex(`courses`);
const postsIndex = client.initIndex(`posts`);
const usersIndex = client.initIndex(`users`);

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

