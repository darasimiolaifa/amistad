import {
  SET_SCREAMS,
  SET_SINGLE_SCREAM,
  LOADING_DATA,
  UNLIKE_SCREAM,
  LIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM
} from "../types";

const initialState = {
  screams: [],
  scream: {},
  loading: false
};

const dataReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOADING_DATA:
      return { ...state, loading: true };
    case SET_SCREAMS:
      return { ...state, screams: payload, loading: false };
    case SET_SINGLE_SCREAM:
      return { ...state, scream: payload };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        scream => scream.screamId === payload.screamId
      );
      state.screams[index] = payload;
      if(state.scream.screamId === payload.screamId) {
        state.scream = payload;
      }
      return { ...state };
    case DELETE_SCREAM:
      let deleteIndex = state.screams.findIndex(
        scream => scream.screamId === payload.screamId
      );
      state.screams.splice(deleteIndex, 1);
      return { ...state };
    case POST_SCREAM:
      return {
        ...state,
        screams: [payload, ...state.screams]
      };
    default:
      return { ...state };
  }
};

export default dataReducer;
