import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.scss";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import jwtDecode from "jwt-decode";

//Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";

//Pages
import account from "./pages/account";
import login from "./pages/login";
import signup from "./pages/signup";
import { themeFile } from "./util/theme";

//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
import axios from "axios";

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme(themeFile);
const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData())
  }
}
class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <StylesProvider jss={jss}>
            <div className="root-container">
              <Router>
                <Navbar />
                <div className="body-container">
                  <Switch>
                    <Route exact path="/account" component={account} />
                    <AuthRoute
                      exact
                      path="/login"
                      component={login}
                    />
                    <AuthRoute
                      exact
                      path="/signup"
                      component={signup}
                    />
                  </Switch>
                </div>
              </Router>
            </div>
          </StylesProvider>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
