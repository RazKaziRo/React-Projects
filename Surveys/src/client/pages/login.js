import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles"; //import global theme settings

import PropTypes from "prop-types";

//MUI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CircularProgress, Link } from "@material-ui/core";
import { themeFile } from "../util/theme";

//Redux
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;

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
              <Link className={classes.helpLink} href="#">
                שכחת סיסמא?
              </Link>
              <Link href="#" className={classes.helpLink}>
                מרכז התמיכה
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(themeFile)(login));
