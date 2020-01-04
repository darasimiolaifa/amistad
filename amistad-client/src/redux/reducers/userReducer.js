import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: []
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return { ...state, ...payload, loading: false, authenticated: true };
    case SET_AUTHENTICATED:
      return { ...state, authenticated: true };
    case LOADING_USER:
      return { ...state, loading: true };
    case SET_UNAUTHENTICATED:
      return initialState;
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          { userHandle: state.credentials.handle, screamId: payload.screamId }
        ]
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(like => like.screamId !== payload.screamId)
      };
    default:
      return { ...state };
  }
};

export default userReducer;
