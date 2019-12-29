import axios from "axios";
import {
  SET_LOADING_STATUS,
  UPDATE_FORM_DATA,
  SET_ERRORS,
  SET_USER,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from "../types";

export const loginUser = async (dispatch, { email, password }, history) => {
  try {
    dispatch({ type: SET_LOADING_STATUS, payload: { isLoading: true } });
    const {
      data: { token }
    } = await axios.post("/login", {
      email,
      password
    });

    setAuthorizationHeader(token);
    await getUserData(dispatch);
    dispatch({
      type: SET_LOADING_STATUS,
      payload: { isLoading: false, email: "", password: "" }
    });
    history.push("/");
  } catch ({ response: { data } }) {
    console.log(data);
    dispatch({
      type: SET_ERRORS,
      payload: { isLoading: false, errors: data, password: "" }
    });
  }
};

export const signupUser = async (
  dispatch,
  { email, password, confirmPassword, handle },
  history
) => {
  try {
    dispatch({ type: SET_LOADING_STATUS, payload: { isLoading: true } });
    const {
      data: { token }
    } = await axios.post("/signup", {
      email,
      password,
      confirmPassword,
      handle
    });
    setAuthorizationHeader(token);
    await getUserData(dispatch);
    dispatch({
      type: SET_LOADING_STATUS,
      payload: {
        isLoading: false,
        email: "",
        password: "",
        confirmPassword: "",
        handle: ""
      }
    });
    history.push("/");
  } catch ({ response: { data } }) {
    console.log(data);
    dispatch({
      type: SET_ERRORS,
      payload: {
        isLoading: false,
        errors: data,
        password: "",
        confirmPassword: ""
      }
    });
  }
};

const setAuthorizationHeader = token => {
  const amistadToken = `Bearer ${token}`;
  localStorage.setItem("amistadToken", amistadToken);
  axios.defaults.headers.common["Authorization"] = amistadToken;
};

export const logoutUser = dispatch => {
  localStorage.removeItem("amistadToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};
export const updateFormData = (dispatch, target) => {
  dispatch({ type: UPDATE_FORM_DATA, payload: target });
};

export const getUserData = async dispatch => {
  try {
    dispatch({ type: LOADING_USER });
    const { data } = await axios.get("/user");
    dispatch({ type: SET_USER, payload: data });
  } catch ({ response: { data } }) {
    dispatch({ type: SET_ERRORS, payload: { errors: data } });
  }
};
