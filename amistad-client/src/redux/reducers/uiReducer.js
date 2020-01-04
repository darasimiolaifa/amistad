import {
  SET_LOADING_STATUS,
  SET_ERRORS,
  UPDATE_FORM_DATA,
  SET_DIALOG_STATUS
} from "../types";

const initialState = {
  isLoading: false,
  errors: {},
  email: "",
  password: "",
  confirmPassword: "",
  handle: "",
  open: false
};

const uiReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING_STATUS:
    case SET_ERRORS:
    case SET_DIALOG_STATUS:
      return { ...state, ...payload };
    case UPDATE_FORM_DATA:
      return { ...state, errors: {}, [payload.name]: payload.value };
    default:
      return { ...state };
  }
};

export default uiReducer;
