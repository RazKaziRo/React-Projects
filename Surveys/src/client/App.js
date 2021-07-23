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
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import { themeFile } from "./util/theme";

//Redux
import { Provider } from "react-redux";
import store from "./redux/store";

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme(themeFile);
const token = localStorage.FBIdToken;

let authenticated = false;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
  } else {
    authenticated = true;
  }
}
console.log("IN APP" + authenticated);

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
                    <Route exact path="/" component={home} />
                    <AuthRoute
                      exact
                      path="/login"
                      component={login}
                      authenticated={authenticated}
                    />
                    <AuthRoute
                      exact
                      path="/signup"
                      component={signup}
                      authenticated={authenticated}
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
