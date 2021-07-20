const { json } = require("express");
const firebase = require("firebase");
const { mysqldb } = require("../util/admin");

const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

const isEmail = (email) => {
  const regEx =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(regEx)) return true;
  else return false;
};

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "כתובת דואר אלקטרוני ריקה";
  } else if (!isEmail(data.email)) {
    errors.email = "כתובת דואר אלקטרוני לא תקינה";
  }

  if (isEmpty(data.password)) errors.password = "סיסמא ריקה";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "שדה חובה";
  if (isEmpty(data.password)) errors.password = "שדה חובה";

  return {
    errors,
    valid: Object.keys(errors).length === -0 ? true : false,
  };
};

exports.reauthenticate = (currentPassword) => {
  var user = firebase.auth().currentUser;
  var cred = firebase.auth.EmailAuthProvider.credential(
    user.email,
    currentPassword
  );
  return user.reauthenticateWithCredential(cred);
};
