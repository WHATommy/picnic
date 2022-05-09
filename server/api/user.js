const express = require("express");
const Router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const validatePasswordInput = require("../validator/password");

// Route    GET api/user/
// Desc     Retrieve information the current user
// Access   Private
Router.get(
    "/",
    authMiddleware,
    async(req, res) => {
        // Find a user inside the database
        const user = await User.findById(req.user);

        if(!user) {
            return res.status(404).send("User does not exist");
        }

        return res.status(200).json(user);
    }
)

// Route    GET api/user/:userId
// Desc     Retrieve information about a user
// Access   Private
Router.get(
    "/:userId",
    authMiddleware,
    async(req, res) => {
        // Find a user inside the database
        const user = await User.findById(req.params.userId);

        if(!user) {
            return res.status(404).send("User does not exist");
        }

        return res.status(200).json(user);

    }
)

// Route    PUT api/user/password
// Desc     Update a user's password
// Access   Private
Router.put(
    "/password",
    authMiddleware,
    async(req, res) => {
        let user;
        // Retrieve a user by ID
        user = await User.findById(req.user).select("+password");
        // Check if user exist in the database
        if (!user) {
            errors.user = "User does not exist";
        }

        // Validate request inputs
        const { errors, isValid } = await validatePasswordInput(req.body, user.password);
                
        // Check validations
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Store request values into callable variables
        const {
            newPassword
        } = req.body;

        try {
            // Update the user's password
            const rounds = require("../config/bcrypt").salt;
            user.password = await bcrypt.hash(newPassword, rounds);

            // Save the user
            await user.save();

            return res.status(200).send("Update successful");
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)


// Route    PUT api/user/
// Desc     Update a user
// Access   Private
Router.put(
    "/",
    authMiddleware,
    async(req, res) => {
        // Store request values into callable variables
        const {
            username,
            email,
            trips,
            invitations
        } = req.body;

        try {
            let user;
            // Retrieve a user by ID
            user = await User.findById(req.user);

            // Check if user exist in the database
            if (!user) {
                return res.status(404).send("User does not exist");
            }

            // Update the user structure
            username ? user.username = username : null;
            email ? user.email = email : null;
            trips ? user.trips = trips : null;
            invitations ? user.invitations = invitations : null;

            // Save the user
            await user.save();

            return res.status(200).json(user);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
        
    }
)

// Route    DELETE api/user/
// Desc     Remove a user
// Access   Private
Router.delete(
    "/",
    authMiddleware,

    async(req, res) => {
        try {
            // Find a user inside the database
            const user = await User.findById(req.user);
            if(!user) {
                return res.status(404).send("User does not exist");
            }

            await user.remove(); 

            return res.status(200).send("User has been removed");

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;