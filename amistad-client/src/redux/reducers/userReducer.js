import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER } from "../types";

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
      return { ...payload, loading: false, authenticated: true };
    case SET_AUTHENTICATED:
      return { ...state, authenticated: true };
    case LOADING_USER:
      return { ...state, loading: true }
    case SET_UNAUTHENTICATED:
      return initialState;
    default:
      return { ...state };
  }
};

export default userReducer;
