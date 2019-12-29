import { SET_LOADING_STATUS, SET_ERRORS, UPDATE_FORM_DATA } from "../types";

const initialState = {
  isLoading: false,
  errors: {},
  email: "",
  password: "",
  confirmPassword: "",
  handle: ""
};

const uiReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING_STATUS:
      return { ...state, ...payload };
    case SET_ERRORS:
      return { ...state, ...payload };
    case UPDATE_FORM_DATA:
      return { ...state, errors: {}, [payload.name]: payload.value };
    default:
      return { ...state };
  }
};

export default uiReducer;
