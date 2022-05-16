const express = require("express");
const Router = express.Router();
const Trip = require("../models/TripModel");
const User = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");
const axios = require("axios");
const baseUrl = require("../util/baseUrl");

// Route    PUT invite/:tripId/:userId/invite
// Desc     Add a user into the trip's pending user, add the invitation to the targeted user's invitation list
// Access   Private
Router.put(
    "/:tripId/:userId/send",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator,
    async(req, res) => {
        const {
            tripId,
            userId
        } = req.params;

        try {
            // Find the user in the database
            const user = await User.findById(userId);
            if (!user) {
                return res.status(401).send("User does not exist");
            }

            // Find the trip in the database
            const trip = await Trip.findById(tripId);
            if (!trip) {
                return res.status(401).send("Trip does not exist");
            }

            // Check if the user being invited is already in the trip or in the pending list
            let isAttendee = trip.attendees.find(attendee => attendee._id.valueOf() === user._id.valueOf());
            if(isAttendee) {
                return res.status(400).send("User is already attending this trip");
            }
            isAttendee = trip.pendingUsers.find(pendingUser => pendingUser._id.valueOf() === user._id.valueOf());
            if(isAttendee) {
                return res.status(400).send("User has already been invited");
            }
            isAttendee = trip.owner === user._id.valueOf();
            if(isAttendee) {
                return res.status(400).send("User is already attending this trip");
            }

            // Add the trip id into the user's list of invitations
            user.invitations.unshift(tripId);
            await axios.put(`${baseUrl}/user/${userId}`, { invitations: user.invitations }, { headers: { "token": req.header("token") } });

            // Add the user id into the trip's list of pending users
            trip.pendingUsers.unshift(userId);
            await axios.put(`${baseUrl}/trip/${tripId}`, { pendingUsers: trip.pendingUsers }, { headers: { "token": req.header("token") } });

            return res.status(200).send("Invite successful");
        } catch (err) {
            //console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT invite/:tripId/accept
// Desc     Add a user into the trip's pending user, add the invitation to the targeted user's invitation list
// Access   Private
Router.put(
    "/:tripId/accept",
    authMiddleware,
    async(req, res) => {
        const {
            tripId
        } = req.params;
        const userId = req.user;

        try {
            // Find the user in the database
            const user = await User.findById(userId);
            if (!user) {
                return res.status(401).send("User does not exist");
            }

            // Check if there is a invitation with the same id as the trip id
            isInvited = user.invitations.find(invite => invite._id.valueOf() === tripId)
            if(isInvited === undefined) {
                return res.status(401).send("Invitation does not exist");
            }

            // Find the trip in the database
            const trip = await Trip.findById(tripId);
            if (!trip) {
                return res.status(401).send("Trip does not exist");
            }

            // Filter out the targeted trip id out of the user's list of invitation and add the trip id into the user's list of trips
            const invitations = user.invitations.filter(invitation => invitation._id.valueOf() !== tripId.valueOf());
            user.trips.unshift(tripId);
            await axios.put(`${baseUrl}/user/${userId}`, { trips: user.trips, invitations }, { headers: { "token": req.header("token") } });

            // Filter out the targeted user id in the trip's list of pending users and add the user id into the list of attendees
            const pendingUsers = trip.pendingUsers.filter(user => user._id.valueOf() !== userId.valueOf());
            trip.attendees.unshift(userId);
            console.log(trip.attendees)

            await axios.put(`${baseUrl}/trip/${tripId}`, { attendees: trip.attendees, pendingUsers }, { headers: { "token": req.header("token") } });
            await axios.post(`${baseUrl}/attendee/${tripId}/${userId}`, {}, { headers: { "token": req.header("token") } });

            return res.status(200).send("Accept successful");
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT invite/:tripId/decline
// Desc     Remove a user from the trip's pending user, remove the invitation from the targeted user's invitation list
// Access   Private
Router.put(
    "/:tripId/decline",
    authMiddleware,
    async(req, res) => {
        const {
            tripId
        } = req.params;

        const userId = req.user;

        try {
            // Find the user in the database
            const user = await User.findById(userId);
            if (!user) {
                return res.status(401).send("User does not exist");
            }

            // Check if there is a invitation with the same id as the trip id
            isInvited = user.invitations.find(invite => invite._id.valueOf() === tripId)
            if(isInvited === undefined) {
                return res.status(401).send("Invitation does not exist");
            }

            // Find the trip in the database
            const trip = await Trip.findById(tripId);
            if (!trip) {
                return res.status(401).send("Trip does not exist");
            }

            // Filter out the targeted trip id out of the user's list of invitation
            const invitations = user.invitations.filter(invitation => invitation._id.valueOf() !== tripId.valueOf());
            await axios.put(`${baseUrl}/user/${userId}`, { invitations }, { headers: { "token": req.header("token") } });

            // Filter out the targeted user id out of the trip's list of pending users
            const pendingUsers = trip.pendingUsers.filter(user => user._id.valueOf() !== userId.valueOf());
            await axios.put(`${baseUrl}/trip/${tripId}`, { pendingUsers }, { headers: { "token": req.header("token") } });

            return res.status(200).send("Decline success");
        } catch (err) {
            //console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;