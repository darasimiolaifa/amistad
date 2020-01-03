import {
  SET_SCREAMS,
  LOADING_DATA,
  UNLIKE_SCREAM,
  LIKE_SCREAM
} from "../types";
import axios from "axios";
import api from "../../util/api";

export const getScreams = async dispatch => {
  try {
    dispatch({ type: LOADING_DATA });
    const { data: screams } = await axios.get(api.screams);
    dispatch({ type: SET_SCREAMS, payload: screams });
  } catch ({ response: { data } }) {
    console.log(data);
    dispatch({ type: SET_SCREAMS, payload: [] });
  }
};

export const likeScream = async (dispatch, screamId) => {
  try {
    const { data: scream } = await axios.get(`${api.screams}/${screamId}/like`);
    dispatch({ type: LIKE_SCREAM, payload: scream });
  } catch ({ response: { data } }) {
    console.log(data);
  }
};
export const unlikeScream = async (dispatch, screamId) => {
  try {
    const { data: scream } = await axios.get(
      `${api.screams}/${screamId}/unlike`
    );
    dispatch({ type: UNLIKE_SCREAM, payload: scream });
  } catch ({ response: { data } }) {
    console.log(data);
  }
};
