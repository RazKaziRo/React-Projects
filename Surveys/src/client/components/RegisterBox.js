import React from "react";

//Register Box
class RegisterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      errors: [],
      pwdState: null,
    };
  }

  showValidationErr(elm, msg) {
    this.setState((prevState) => ({
      errors: [...prevState.errors, { elm, msg }],
    }));
  }

  clearValidationErr(elm) {
    this.setState((prevState) => {
      let newArr = [];
      for (let err of prevState.errors) {
        if (elm != err.elm) {
          newArr.push(err);
        }
      }
      return { errors: newArr };
    });
  }

  onUsernameChange(e) {
    this.setState({ username: e.target.value });
    this.clearValidationErr("username");
  }
  onEmailChange(e) {
    this.setState({ email: e.target.value });
    this.clearValidationErr("email");
  }
  onPasswordChange(e) {
    this.setState({ password: e.target.value });
    this.clearValidationErr("password");
    this.setState({ pwdState: "weak" });

    if (e.target.value.length > 8) {
      this.setState({ pwdState: "medium" });
    }
    if (e.target.value.length > 12) {
      this.setState({ pwdState: "strong" });
    }
  }

  submitRegister(elm) {
    if (this.state.username === "") {
      this.showValidationErr("username", "Username Cannot be empty!");
    }
    if (this.state.email === "") {
      this.showValidationErr("email", "Email cannot be empty!");
    }
    if (this.state.password === "") {
      this.showValidationErr("password", "Password cannot be empty!");
    }
  }

  render() {
    let usernameErr = null,
      passwordErr = null,
      emailErr = null;

    for (let err of this.state.errors) {
      if (err.elm === "username") {
        usernameErr = err.msg;
      }
      if (err.elm === "email") {
        emailErr = err.msg;
      }
      if (err.elm === "password") {
        passwordErr = err.msg;
      }
    }

    let weakPwd,
      mediumPwd,
      strongPwd = false;

    if (this.state.pwdState === "weak") {
      weakPwd = true;
    } else if (this.state.pwdState === "medium") {
      weakPwd = true;
      mediumPwd = true;
    } else if (this.state.pwdState === "strong") {
      weakPwd = true;
      mediumPwd = true;
      strongPwd = true;
    }

    return (
      <div className="inner-container">
      
        <div className="header">
        <div className="img-container">
            <img className="header-img" src="./register-header-img.jpg" />
          </div>
        Register</div>
        <div className="box">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              className="login-input"
              placeholder="Username"
              onChange={this.onUsernameChange.bind(this)}
            />
            <small className="danger-error">
              {usernameErr ? usernameErr : ""}
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              className="login-input"
              placeholder="Email"
              onChange={this.onEmailChange.bind(this)}
            />
            <small className="danger-error">{emailErr ? emailErr : ""}</small>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              className="login-input"
              placeholder="Password"
              onChange={this.onPasswordChange.bind(this)}
            />
            <small className="danger-error">
              {passwordErr ? passwordErr : ""}
            </small>

            {this.state.password && 
            <div className="password-state">
              <div className={"pwd pwd-weak " + (weakPwd ? "show" : "")}></div>
              <div
                className={"pwd pwd-medium " + (mediumPwd ? "show" : "")}
              ></div>
              <div
                className={"pwd pwd-strong " + (strongPwd ? "show" : "")}
              ></div>
            </div>
            }
          </div>
          <button
            type="button"
            className="login-btn"
            onClick={this.submitRegister.bind(this)}
          >
            Register
          </button>
        </div>
      </div>
    );
  }
}

export default RegisterBox;
