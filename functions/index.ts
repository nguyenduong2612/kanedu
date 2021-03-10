var algoliasearch = require("algoliasearch");
var functions = require("firebase-functions");

const env = functions.config();

const client = algoliasearch(env.algolia.appid, env.algolia.apikey, {
  timeouts: {
    connect: 5,
    read: 10,
    write: 40,
  },
});
const coursesIndex = client.initIndex(`courses`);
const postsIndex = client.initIndex(`posts`);
const usersIndex = client.initIndex(`users`);

exports.algoliaCoursesSync = functions.firestore
  .document(`courses/{doc}`)
  .onWrite(async (change, _context) => {
    console.log(env.algolia.appid, env.algolia.apikey);
    const oldData = change.before;
    const newData = change.after;
    const data = newData.data();
    const objectID = newData.id;

    if (!oldData.exists && newData.exists) {
      // creating
      return coursesIndex.saveObject(Object.assign({}, { objectID }, data));
    } else if (!newData.exists && oldData.exists) {
      // deleting
      return coursesIndex.deleteObject(objectID);
    } else {
      // updating
      return coursesIndex.saveObject(Object.assign({}, { objectID }, data));
    }
  });

exports.algoliaPostsSync = functions.firestore
  .document(`posts/{doc}`)
  .onWrite(async (change, _context) => {
    console.log(env.algolia.appid, env.algolia.apikey);
    const oldData = change.before;
    const newData = change.after;
    const data = newData.data();
    const objectID = newData.id;

    if (!oldData.exists && newData.exists) {
      // creating
      return postsIndex.saveObject(Object.assign({}, { objectID }, data));
    } else if (!newData.exists && oldData.exists) {
      // deleting
      return postsIndex.deleteObject(objectID);
    } else {
      // updating
      return postsIndex.saveObject(Object.assign({}, { objectID }, data));
    }
  });

exports.algoliaUsersSync = functions.firestore
  .document(`users/{doc}`)
  .onWrite(async (change, _context) => {
    console.log(env.algolia.appid, env.algolia.apikey);
    const oldData = change.before;
    const newData = change.after;
    const data = newData.data();
    const objectID = newData.id;

    if (!oldData.exists && newData.exists) {
      // creating
      return usersIndex.saveObject(Object.assign({}, { objectID }, data));
    } else if (!newData.exists && oldData.exists) {
      // deleting
      return usersIndex.deleteObject(objectID);
    } else {
      // updating
      return usersIndex.saveObject(Object.assign({}, { objectID }, data));
    }
  });

exports.detectText = functions.https.onCall(async (data, context) => {
  const image = data.image;

  // Checking attribute.
  if (!(typeof image === "string") || image.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        'one arguments "text" containing the message text to add.'
    );
  }
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }

  // Imports the Google Cloud client library
  const vision = require("@google-cloud/vision");
  const { Translate } = require("@google-cloud/translate").v2;

  // Create clients
  const visionClient = new vision.ImageAnnotatorClient();
  const translateClient = new Translate();

  const [textRequest] = await visionClient.documentTextDetection(data.image);
  const fullText = textRequest.textAnnotations[0];
  const text = fullText ? fullText.description : null;

  const [translation] = await translateClient.translate(text, "vi");

  return { text, translation };
});
