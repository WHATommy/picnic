const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(req) {
  let errors = {};

  req.email = !isEmpty(req.email) ? req.email : '';
  req.password = !isEmpty(req.password) ? req.password : '';

  if (!Validator.isEmail(req.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(req.email)) {
    errors.email = 'Email is required';
  }

  if (Validator.isEmpty(req.password)) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};