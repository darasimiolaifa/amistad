import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";
import "./App.css";
import appTheme from "./util/theme";
import AuthRoute from "./util/AuthRoute";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

//Components
import Navbar from "./components/layout/Navbar";
// Pages
import home from "./pages/home";
import user from "./pages/user";
import signup from "./pages/signup";
import login from "./pages/login";


const theme = createMuiTheme(appTheme);

const MyApp = () => {
  const dispatch = useDispatch();
  const token = localStorage.amistadToken;
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      logoutUser(dispatch);
      window.location.href = "/login";
    } else {
      dispatch({ type: SET_AUTHENTICATED });
      axios.defaults.headers.common["Authorization"] = token;
      getUserData(dispatch);
    }
  }
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={home} />
            <Route exact path="/user/:handle" component={user} />
            <Route
              exact
              path="/user/:handle/screams/:screamId"
              component={user}
            />
            <AuthRoute exact path="/signup" component={signup} />
            <AuthRoute exact path="/login" component={login} />
          </Switch>
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

export default MyApp;
