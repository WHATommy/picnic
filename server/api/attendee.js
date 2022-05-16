const express = require('express');
const Router = express.Router();
const Attendee = require("../models/AttendeeModel");
const User = require("../models/UserModel");
const Trip = require("../models/TripModel");
const Event = require("../models/EventModel");
const Housing = require("../models/HousingModel");
const Restaurant = require("../models/RestaurantModel");
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");
const axios = require('axios');
const baseUrl = require('../util/baseUrl');
const restaurant = require('../validator/restaurant');

// Route    GET api/attendee/:tripId/
// Desc     Get list of attendees from a trip
// Access   Public
Router.get(
    "/:tripId",
    async (req, res) => {

        // Store request values into callable variables
        const {
            tripId
        } = req.params;

        try {
            const attendees = await Attendee.find({tripId: tripId});
            return res.status(200).json(attendees);

        } catch (err) {
            //console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    GET api/attendee/:tripId/
// Desc     Get a attendee from a trip
// Access   Public
Router.get(
    "/:tripId/:userId",
    async (req, res) => {

        // Store request values into callable variables
        const {
            tripId,
            userId
        } = req.params;

        try {
            const attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            return res.status(200).json(attendee);

        } catch (err) {
            //console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    POST api/attendee/:tripId/:userId
// Desc     Add a user into the trip's attendees
// Access   Public
Router.post(
    "/:tripId/:userId",
    authMiddleware,
    async (req, res) => {

        // Store request values into callable variables
        const {
            tripId,
            userId
        } = req.params;

        try {
            
            const newAttendee = new Attendee({
                tripId,
                userId
            });
            await newAttendee.save();

            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}/personalcost`, {}, { headers: { "token": req.header("token") } })

            return res.status(200).json(newAttendee);

        } catch (err) {
            //console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    PUT api/attendee/:tripId/:userId/personalcost
// Desc     Update a user's personal cost
// Access   Public
Router.put(
    "/:tripId/:userId/personalcost",
    authMiddleware,
    async (req, res) => {

        // Store request values into callable variables
        const {
            tripId,
            userId
        } = req.params;
        try {

            let attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            let eventCost = 0, housingCost = 0, restaurantCost = 0;

            if(attendee.attending.events.length > 0) {
                eventCost = await attendee.attending.events.reduce(async (sum, eventId) => {
                    const event = await Event.findById(eventId);
                    return sum += event.cost;
                }, 0);
            }

            if(attendee.attending.housings.length > 0) {
                housingCost = await attendee.attending.housings.reduce(async (sum, housingId) => {
                    const housing = await Housing.findById(housingId);
                    return sum += housing.cost;
                }, 0);
            }
            
            if(attendee.attending.restaurants.length > 0) {
                restaurantCost = await attendee.attending.restaurants.reduce(async (sum, restaurantId) => {
                    const restaurant = await Restaurant.findById(restaurantId);
                    return sum += restaurant.cost;
                }, 0);
            }

            attendee.personalCost = eventCost + housingCost + restaurantCost;
            await attendee.save();

            return res.status(200).json(attendee);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    PUT api/attendee/:tripId/:userId
// Desc     Update a user into the trip's attendees
// Access   Public
Router.put(
    "/:tripId/:userId",
    async (req, res) => {

        // Store request values into callable variables
        const {
            tripId,
            userId
        } = req.params;
        const {
            attending
        } = req.body;
        try {
           
            let attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            attending ? attendee.attending = attending : null;

            await attendee.save();

            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}/personalcost`, {}, { headers: { "token": req.header("token") } });

            return res.status(200).json(attendee);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    PUT api/attendee/:tripId/:userId
// Desc     Update a trip's moderator
// Access   Private
Router.put(
    "/:tripId/:userId/mod",
    authMiddleware,
    tripMiddleware.isOwner,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            userId
        } = req.params;

        try {
            
            // Find the attendee in the trip
            let attendee = await Attendee.findOne({tripId: tripId, userId: userId});

            // Change the moderator status of this attendee
            attendee.moderator = !attendee.moderator

            // Save into the attendee collection
            await attendee.save();

            return res.status(200).json(attendee)
            
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    DELETE api/attendee/:tripId/:userId
// Desc     Remove a user into the trip's attendees
// Access   Public
Router.delete(
    "/:tripId/:userId",
    authMiddleware,
    async (req, res) => {

        // Store request values into callable variables
        const {
            tripId,
            userId
        } = req.params;

        try {

            // Find the attendee in the attendees database
            const attendee = await Attendee.findOne({ tripId: tripId, userId: userId });
            if(!attendee) {
                return res.status(404).json("User is not attending this trip")
            }

            // Find the trip in the trip database
            let trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).json("Trip does not exist")
            }

            trip.attendees = trip.attendees.filter(attendeeId => attendeeId._id.valueOf() !== userId);
            await axios.put(`${baseUrl}/trip/${tripId}`, { attendees: trip.attendees }, { headers: { "token": req.header("token") } });

            // Remove attendee from all events in the trip
            await attendee.attending.events.forEach(async eventId => {
                await axios.put(`${baseUrl}/event/${tripId}/${eventId._id.valueOf()}/${userId}/leave`, {}, { headers: { "token": req.header("token") } });
            });

            // Remove attendee from all housings in the trip
            await attendee.attending.housings.forEach(async housingId => {
                await axios.put(`${baseUrl}/housing/${tripId}/${housingId._id.valueOf()}/${userId}/leave`, {}, { headers: { "token": req.header("token") } });
            });

            // Remove attendee from all restaurants in the trip
            await attendee.attending.restaurants.forEach(async restaurantId => {
                await axios.put(`${baseUrl}/restaurant/${tripId}/${restaurantId._id.valueOf()}/${userId}/leave`, {}, { headers: { "token": req.header("token") } });
            });

            await attendee.remove();

            return res.status(200).json("Attendee has been removed");

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

module.exports = Router;