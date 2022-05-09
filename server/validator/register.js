const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(req) {
  let errors = {};

  req.username = !isEmpty(req.username) ? req.username : "";
  req.email = !isEmpty(req.email) ? req.email : "";
  req.password = !isEmpty(req.password) ? req.password : "";
  req.password2 = !isEmpty(req.confirmPassword) ? req.confirmPassword : "";

  if (!Validator.isLength(req.username, { min: 3, max: 30 })) {
    errors.username = "Username must be between 3 and 30 characters";
  }

  if (Validator.isEmpty(req.username)) {
    errors.username = "Username field is required";
  }

  if (Validator.isEmpty(req.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(req.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(req.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(req.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(req.confirmPassword)) {
    errors.confirmPassword = "Confirm Password field is required";
  }

  if (!Validator.equals(req.password, req.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};