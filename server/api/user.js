const express = require("express");
const Router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const validatePasswordInput = require("../validator/password");
const cloudinary = require("../util/cloudinary");
const upload = require("../util/mutler");

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
// Desc     Update current user
// Access   Private
Router.put(
    "/",
    authMiddleware,
    upload.single("image"),
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

            let cloudinaryResult = null;
            // Upload image to cloudinary
            if(req.file) {
                // Remove current icon image from cloudinary
                await cloudinary.uploader.destroy(user.profilePic.cloudinaryId);
                cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
            }

            // Update the user structure
            cloudinaryResult ? user.profilePic = {
                image: cloudinaryResult.secure_url,
                cloudinaryId: cloudinaryResult.public_id
            } : null;
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

// Route    PUT api/user/
// Desc     Update current user
// Access   Private
Router.put(
    "/profilePicReset",
    authMiddleware,
    async(req, res) => {

        try {
            let user;
            // Retrieve a user by ID
            user = await User.findById(req.user);

            // Check if user exist in the database
            if (!user) {
                return res.status(404).send("User does not exist");
            }

            // Update the user's profile picture to default
            user.profilePic = {
                image: "https://res.cloudinary.com/dkf1fcytw/image/upload/v1652972711/user_tdosel.png",
                cloudinaryId: "user_tdosel"
            }

            // Save the user
            await user.save();

            return res.status(200).json(user);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
        
    }
)

// Route    PUT api/user/:userId
// Desc     Update a user
// Access   Private
Router.put(
    "/:userId",
    authMiddleware,
    async(req, res) => {
        // Store request values into callable variables
        const {
            userId
        } = req.params;
        const {
            username,
            email,
            trips,
            invitations
        } = req.body;

        try {
            let user;
            // Retrieve a user by ID
            user = await User.findById(userId);

            // Check if user exist in the database
            if (!user) {
                return res.status(404).send("User does not exist");
            }

            // Update the user structure
            username ? user.username = username : null;
            email ? user.email = email : null;
            user.trips = trips;
            user.invitations = invitations

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
            };

            // Filter out the targeted user id out of the trip's list of attendees and pending users
            await user.trips.map(async tripId => {
                const trip = await axios.get((`${baseUrl}/trip/${tripId}`, {}, { headers: { "token": req.header("token") } }));
                const attendees = await trip.attendees.filter(userId => user._id.valueOf() !== userId.valueOf());
                const pendingUsers = await trip.pendingUsers.filter(userId => user._id.valueOf() !== userId.valueOf());
                await axios.put(`${baseUrl}/trip/${tripId}`, { attendees, pendingUsers }, { headers: { "token": req.header("token") } });
            });

            // Delete user's profile picture from database if it is not default
            if(user.profilePic.cloudinaryId !== "user_tdosel") {
                await cloudinary.uploader.destroy(user.profilePic.cloudinaryId);
            }
            
            // Remove user from database
            await user.remove(); 

            // Return successful
            return res.status(200).send("User has been removed");

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;