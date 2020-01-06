import {
  SET_SCREAMS,
  SET_SINGLE_SCREAM,
  SET_ERRORS,
  SET_LOADING_STATUS,
  POST_SCREAM,
  LOADING_DATA,
  UNLIKE_SCREAM,
  LIKE_SCREAM,
  DELETE_SCREAM
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

export const postScream = async (dispatch, newScream) => {
  try {
    dispatch({ type: SET_LOADING_STATUS, payload: { isLoading: true } });
    const { data: scream } = await axios.post(api.screams, newScream);
    dispatch({ type: POST_SCREAM, payload: scream });
    dispatch({ type: SET_LOADING_STATUS, payload: { isLoading: false } });
  } catch ({ response: { data } }) {
    console.log(data);
    dispatch({ type: SET_ERRORS, payload: data });
  }
};

export const getSingleScream = async (dispatch, screamId) => {
  try {
    dispatch({ type: SET_LOADING_STATUS, payload: { isLoading: true } });
    const { data: scream } = await axios.get(`${api.screams}/${screamId}`);
    console.log(scream);
    dispatch({ type: SET_SINGLE_SCREAM, payload: scream });
    dispatch({ type: SET_LOADING_STATUS, payload: { isLoading: false } });
  } catch ({ response: { data } }) {
    console.log(data);
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

export const deleteScream = async (dispatch, screamId) => {
  try {
    await axios.delete(`${api.screams}/${screamId}`);
    dispatch({ type: DELETE_SCREAM, payload: { screamId } });
  } catch (error) {
    console.log(error);
  }
};
