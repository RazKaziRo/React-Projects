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
import { signupUser } from "../redux/actions/userActions";

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      comfirmPassword: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.UI.errors){
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.password,
    };
    this.props.signupUser(newUserData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes, UI:{loading} } = this.props;
    const {  errors } = this.state;

    return (
      <div className={classes.formWrapper}>
        <div className={classes.topSection}>
          <img
            src="https://i.imgur.com/ZG7BOyC.png"
            alt="surveys-logo"
            className={classes.mainLogo}
          />
          <div className={classes.greetgText}>
            קבל נתונים טובים יותר בעזרת טפסים לשיחות, סקרים, חידונים ועוד.
          </div>
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
              צור חשבון בחינם
              {loading && (
                <CircularProgress size={25} className={classes.progress} />
              )}
            </Button>
            <small>
              כבר יש לך חשבון?{" "}
              <Link href="login" to="/login">
                התחברות
              </Link>
            </small>
          </form>
        </div>
      </div>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, { signupUser })(
  withStyles(themeFile)(signup)
);
