var algoliasearch = require("algoliasearch");
var functions = require("firebase-functions");

const env = functions.config();

// const client = algoliasearch(env.algolia.appid, env.algolia.apikey, {
//   timeouts: {
//     connect: 5,
//     read: 10,
//     write: 40
//   }
// })
// const coursesIndex = client.initIndex(`courses`)

// exports.algoliaCoursesSync = functions
//   .firestore.document(`courses/{doc}`).onWrite(async (change, _context) => {
//     console.log(env.algolia.appid, env.algolia.apikey)
//     const oldData = change.before
//     const newData = change.after
//     const data = newData.data()
//     const objectID = newData.id

//     if (!oldData.exists && newData.exists) {
//       // creating
//       return coursesIndex.saveObject(Object.assign({}, { objectID }, data))
//     } else if (!newData.exists && oldData.exists) {
//       // deleting
//       return coursesIndex.deleteObject(objectID)
//     } else  {
//       // updating
//       return coursesIndex.saveObject(Object.assign({}, { objectID }, data))
//     }
//  })

// exports.addTest = functions.firestore
//   .document(`courses/{courseId}/lessons/{lessonId}/cards/{cardId}`)
//   .onWrite(async (change, _context) => {
//     const oldData = change.before;
//     const newData = change.after;
//     const data = newData.data();
//     console.log(data)
//   });
