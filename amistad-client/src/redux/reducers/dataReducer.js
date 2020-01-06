import {
  SET_SCREAMS,
  SET_SINGLE_SCREAM,
  LOADING_DATA,
  LOADING_USER_DATA,
  UNLIKE_SCREAM,
  SET_DIALOG_STATUS,
  LIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  ADD_COMMENTS
} from "../types";

const initialState = {
  screams: [],
  scream: {},
  loading: false,
  userLoading: false,
  screamDialogLoading: false
};

const dataReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOADING_DATA:
    case SET_DIALOG_STATUS:
    case LOADING_USER_DATA:
      return { ...state, ...payload };
    case SET_SCREAMS:
      return { ...state, screams: payload, loading: false };
    case SET_SINGLE_SCREAM:
      return { ...state, scream: payload };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      const index = state.screams.findIndex(
        scream => scream.screamId === payload.screamId
      );
      state.screams[index] = payload;
      if (state.scream.screamId === payload.screamId) {
        state.scream = payload;
      }
      return { ...state };
    case DELETE_SCREAM:
      const deleteIndex = state.screams.findIndex(
        scream => scream.screamId === payload.screamId
      );
      state.screams.splice(deleteIndex, 1);
      return { ...state };
    case POST_SCREAM:
      return {
        ...state,
        screams: [payload, ...state.screams]
      };
    case ADD_COMMENTS:
      const screamIndex = state.screams.findIndex(
        scream => scream.screamId === payload.screamId
      );
      const newScream = {
        ...state.scream,
        commentCount: state.scream.commentCount + 1,
        comments: [payload, ...state.scream.comments]
      };
      state.screams[screamIndex] = newScream;
      return { ...state, scream: newScream };
    default:
      return { ...state };
  }
};

export default dataReducer;
