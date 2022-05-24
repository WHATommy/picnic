const express = require('express');
const Router = express.Router();
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateLoginInput = require("../validator/login");

// Route    POST api/auth
// Desc     Validate user's credentials, give a token if valid
// Access   Public
Router.post(
    "/",
    async (req, res) => {
        // Validate request inputs
        const { errors, isValid } = validateLoginInput(req.body);
        
        // Check validations
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Store request values into callable variables
        const {
            email,
            password
        } = req.body;

        try {
            // Check if incoming email exist in the database
            const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
            if(!user) {
                return res.status(401).send("Your email or password may be incorrect, or you have not register an account under these credentials.");
            }

            // Check if the incoming password matches with the selected user's password through bcrypt
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).send("Your email or password may be incorrect, or you have not register an account under these credentials.");
            }

            // Create a token for the user using JWT
            const payload = { userId: user._id };
            const jwtSecret = require("../config/keys").secretOrKey;
            jwt.sign(payload, jwtSecret, {expiresIn: "7d"}, (err, token) => {
                if (err) throw err;
                res.status(200).json(token);
            });

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;