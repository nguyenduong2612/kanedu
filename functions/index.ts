// Imports the Google Cloud client library
const admin = require('firebase-admin');
const algoliasearch = require("algoliasearch");
const functions = require("firebase-functions");
const vision = require("@google-cloud/vision");
const { Translate } = require("@google-cloud/translate").v2;

const env = functions.config();
admin.initializeApp();
const db = admin.firestore();

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

// Create clients
const translateClient = new Translate();

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

  // Create clients
  const visionClient = new vision.ImageAnnotatorClient();

  let [textRequest] = await visionClient.documentTextDetection(data.image);
  let fullText = textRequest.textAnnotations[0];
  let text = fullText ? fullText.description : null;

  let [translation] = await translateClient.translate(text, "vi");

  return { text, translation };
});

exports.translateText = functions.https.onCall(async (data, _context) => {
  let text = data.text;
  let target = data.target;

  let [translation] = await translateClient.translate(text, target);
  return { text, translation };
});

exports.resetDailyGoal = functions.pubsub.schedule('0 0 * * *')
  .timeZone('Asia/Ho_Chi_Minh')
  .onRun(async(context) => {
    console.log('Reset daily goal');
    let snap = await db.collection("users").get();
    snap.docs.map(async(user) => {
      user.ref.update({dailyObject: 0})
    })
});