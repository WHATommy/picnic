const Validator = require("validator");
const isEmpty = require("./isEmpty");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

module.exports = async function validatePasswordInput(req, password) {
    let errors = {};

    req.currentPassword = !isEmpty(req.currentPassword) ? req.currentPassword : "";
    req.newPassword = !isEmpty(req.newPassword) ? req.newPassword : "";
    req.confirmNewPassword = !isEmpty(req.confirmNewPassword) ? req.confirmNewPassword : "";

    if(Validator.isEmpty(req.currentPassword)) {
        errors.currentPassword = "Current password cannot be empty"
    }

    if(Validator.isEmpty(req.newPassword)) {
        errors.newPassword = "New password cannot be empty"
    }

    if(Validator.isEmpty(req.confirmNewPassword)) {
        errors.confirmNewPassword = "Confirm new password cannot be empty"
    }

    if (!Validator.equals(req.newPassword, req.confirmNewPassword)) {
        errors.matchPassword = "New password and confirm new password must match";
    } else {
        if (Validator.equals(req.newPassword, req.currentPassword)) {
            errors.newPassword = "New password has to be different from the current one";
        }
    }

    // Check if the user's input for old password matches with their current password
    const isPassword = await bcrypt.compare(req.currentPassword, password);
    if (!isPassword) {
        errors.currentPassword = "Current password is invalid";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}