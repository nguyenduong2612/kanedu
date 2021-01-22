const initialState = {
  favoritePosts: [],
};

export function setFavoritePost(post_id: string) {
  return {
    type: "SET_FAVORITE_POST",
    payload: post_id,
  };
}

export function removeFavoritePost(post_index: number) {
  return {
    type: "REMOVE_FAVORITE_POST",
    payload: post_index,
  };
}

export function postsReducer(state = initialState, action: any) {
  switch (action.type) {
    case "SET_FAVORITE_POST":
      return {
        ...state,
        favoritePosts: [...state.favoritePosts, action.payload],
      };
    case "REMOVE_FAVORITE_POST":
      return {
        ...state,
        favoritePosts: [
          ...state.favoritePosts.slice(0, action.payload),
          ...state.favoritePosts.slice(action.payload + 1),
        ],
      };
    default:
      return state;
  }
}