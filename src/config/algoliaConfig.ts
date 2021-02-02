import algoliasearch from "algoliasearch";

const algoliaClient = algoliasearch(
  String(process.env.REACT_APP_ALGOLIA_APP_ID),
  String(process.env.REACT_APP_ALGOLIA_ADMIN_KEY)
);

export { algoliaClient }
