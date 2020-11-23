import * as functions from 'firebase-functions'
import * as algoliasearch from 'algoliasearch'

const env = functions.config()

const client = algoliasearch(env.algolia.appid, env.algolia.apikey)
const adultsIndex = client.initIndex(`courses`)

export const algoliaCoursesSync = functions
  .firestore.document(`courses/{doc}`).onWrite(async (change, _context) => {
    const oldData = change.before
    const newData = change.after
    const data = newData.data()
    const objectID = newData.id 

    if (!oldData.exists && newData.exists) {
      // creating
      return adultsIndex.addObject(Object.assign({}, { objectID }, data))
    } else if (!newData.exists && oldData.exists) {
      // deleting
      return adultsIndex.deleteObject(objectID)
    } else  {
      // updating
      return adultsIndex.saveObject(Object.assign({}, { objectID }, data))
    }
  })
