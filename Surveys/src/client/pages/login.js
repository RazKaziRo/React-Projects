import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles"; //import global theme settings

import PropTypes from "prop-types";

//MUI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CircularProgress, Link } from "@material-ui/core";
import axios from "axios";
import {themeFile} from '../util/theme';

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {},
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    axios
      .post("/login", userData)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
        this.setState({
          loading: false,
        });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log('ERROR: '+ JSON.stringify(err));
        this.setState({
          errors: err.response.data,
          loading: false,
        });
      });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { loading, errors } = this.state;

    return (
      <div className={classes.formWrapper}>
        <div className={classes.topSection}>
          <img
            src="https://i.imgur.com/ZG7BOyC.png"
            alt="surveys-logo"
            className={classes.mainLogo}
          />
          <div className={classes.greetgText}>שלום, מי אתה?</div>
        </div>
        <div className={classes.formContainer}>
          <form
            noValidate
            onSubmit={this.handleSubmit}
            className={classes.loginForm}
          >
            <TextField
              id="email"
              name="email"
              label="דואר אלקטרוני"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
            />

            <TextField
              id="password"
              name="password"
              label="סיסמא"
              className={classes.textField}
              helperText={errors.password}
              value={this.state.password}
              error={errors.password ? true : false}
              onChange={this.handleChange}
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              התחברות
              {loading && (
                <CircularProgress size={25} className={classes.progress} />
              )}
            </Button>
            <div className={classes.buttomHelpWrapper}>
              <small className={classes.helpText}>זקוק לעזרה?</small>
                <Link className={classes.helpLink} href="#">שכחת סיסמא?</Link>
                <Link href="#" className={classes.helpLink}>מרכז התמיכה</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(themeFile)(login);