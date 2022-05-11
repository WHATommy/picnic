const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRestaurantInput(req) {
    let errors = {};

    req.name = !isEmpty(req.name) ? req.name : "";
    req.location = !isEmpty(req.location) ? req.location : "";
    req.startDate = !isEmpty(req.startDate) ? req.startDate : "";
    req.endDate = !isEmpty(req.endDate) ? req.endDate : "";

    if (Validator.isEmpty(req.name)) {
        errors.name = "Name cannot be empty";
    }

    if (Validator.isEmpty(req.location)) {
        errors.location = "Location cannot be empty";
    }

    if(!Validator.isDate(Validator.toDate(req.startDate))) {
        errors.startDate = "The start date must be valid"
    }   

    if (Validator.isEmpty(req.startDate)) {
        errors.startDate = "The restaurant must have a start date";
    }

    if(!Validator.isDate(Validator.toDate(req.endDate))) {
        errors.endDate = "The end date must be valid"
    }   

    if (Validator.isEmpty(req.endDate)) {
        errors.endDate = "The restaurant must have a end date";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};