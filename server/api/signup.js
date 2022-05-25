const express = require("express");
const Router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validator/register");
const cloudinary = require("../util/cloudinary");
const upload = require("../util/mutler");

// Route    POST signup/checkusername
// Desc     Check if username is unique
// Access   Public
Router.get(
    "/checkusername/:username",
    async (req, res) => {
        try {
            const username = await User.findOne({ username: req.params.username.toLowerCase() });
            if(username) {
                return res.send(false);
            }
           return res.send(true);
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error");
        }
    }
)

// Route    POST signup/checkemail
// Desc     Check if username is unique
// Access   Public
Router.get(
    "/checkemail/:email",
    async (req, res) => {
        try {
            const email = await User.findOne({ email: req.params.email.toLowerCase() });
            if(email) {
                return res.send(false);
            }
           return res.send(true);
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error")
        }
    }
)

// Route    POST signup
// Desc     Register user into the database
// Access   Public
Router.post(
    "/", 
    upload.single("image"),
    async (req, res) => {
        // Validate request inputs
        const { errors, isValid } = validateRegisterInput(req.body);
        
        // Check validations
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Store request values into callable variables
        const {
            username,
            email,
            password
        } = req.body;

        try {
            // Initialize empty user varaible
            let user;

            // Initialize error
            let error = [];

            // Check if a user with that email exist in the system
            user = await User.findOne({ email: email.toLowerCase() });
            if(user) {
                error.push({email: "Email is already in use"});
            };

            // Check if a user with that username exist in the system
            user = await User.findOne({ username: username.toLowerCase() });
            if(user) {
                error.push({username: "Username is already taken"});
            };

            // If errors exist, return unsuccessful with errors
            if(error.length !== 0) {
                return res.status(401).send(error);
            };

            // Initialize empty cloudinary result
            let cloudinaryResult;
            // Upload image to cloudinary
            if(req.file) {
                cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
            }

            // User structure
            user = new User({
                profilePic: cloudinaryResult ? {
                    image: cloudinaryResult.secure_url,
                    cloudinaryId: cloudinaryResult.public_id
                } : null,
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password,
                trips: [],
                invitations: []
            });

            // Hashing the password using bcrypt algorithm
            const rounds = require("../config/bcrypt").salt;
            user.password = await bcrypt.hash(password, rounds);

            // Save the user into the database
            await user.save().then(() => {
                // Create a token for the user using JWT
                const payload = { userId: user._id };
                const jwtSecret = require("../config/keys").secretOrKey;
                jwt.sign(payload, jwtSecret, { expiresIn: "7d" }, (err, token) => {
                    if (err) throw err;
                    res.status(200).json(token);
                });
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error")
        }
    }
)

module.exports = Router;