const express = require("express");
const Router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validator/register");
const cloudinary = require("../util/cloudinary");
const upload = require("../util/mutler");

// Route    POST api/signup
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
            // Initalize empty user varaible
            let user;

            // Check if a user with that email exist in the system
            user = await User.findOne({ email: email.toLowerCase() });
            if(user) {
                return res.status(401).send([{msg:"Email is already in use"}]);
            };

            // Check if a user with that username exist in the system
            user = await User.findOne({ username: username.toLowerCase() });
            if(user) {
                return res.status(401).send([{msg:"Username is already taken"}]);
            };

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