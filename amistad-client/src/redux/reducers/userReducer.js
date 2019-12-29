import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from "../types";

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  notifications: []
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return { ...payload, authenticated: true };
    case SET_AUTHENTICATED:
      return { ...state, authenticated: true };
    case SET_UNAUTHENTICATED:
      return initialState;
    default:
      return { ...state };
  }
};

export default userReducer;
