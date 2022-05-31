// Routers
const express = require('express');
const Router = express.Router();

// Models
const Attendee = require("../models/AttendeeModel");
const Trip = require("../models/TripModel");
const Event = require("../models/EventModel");
const Housing = require("../models/HousingModel");
const Restaurant = require("../models/RestaurantModel");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");

// API request tools
const axios = require('axios');
const baseUrl = require('../util/baseUrl');

// Route    GET api/attendee/:tripId/
// Desc     Get list of attendees from a trip
// Access   Private
Router.get(
    "/:tripId",
    authMiddleware,
    async (req, res) => {

        // Store request values into callable variables
        const {
            tripId
        } = req.params;

        try {
            // Find all attendees that are attending the trip from the attendees database
            const attendees = await Attendee.find({tripId: tripId});
            
            // If attendee does not exist, return failure
            if(!attendees) {
                return res.status(404).json("Attendee does not exist");
            }

            // Return successful
            return res.status(200).json(attendees);

        } catch (err) {
            return res.status(500).send("Server error");
        }
    }
);

// Route    GET api/attendee/:tripId/:userId
// Desc     Get a attendee from a trip
// Access   Private
Router.get(
    "/:tripId/:userId",
    authMiddleware, 
    async (req, res) => {

        // Store request values into callable variables
        const {
            tripId,
            userId
        } = req.params;

        try {
            // Find attendee in attendees database
            const attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            // If attendee does not exist, return failure
            if(!attendee) {
                return res.status(404).json("Attendee does not exist");
            }

            // Return successful
            return res.status(200).json(attendee);

        } catch (err) {
            //console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    POST attendee/:tripId/:userId
// Desc     Add a user into the trip's attendees
// Access   Private
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
            
            // Construct new attendee
            const newAttendee = new Attendee({
                tripId,
                userId
            });

            // Save new attendee to the attendee's database
            await newAttendee.save();

            // Return successful
            return res.status(200).json(newAttendee);

        } catch (err) {
            //console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    PUT api/attendee/:tripId/:userId/personalcost
// Desc     Update a user's personal cost
// Access   Private
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

            // Find attendee in the attendees database
            let attendee = await Attendee.findOne({tripId: tripId, userId: userId});

            // If attendee does not exist, return failure
            if(!attendee) {
                return res.status(404).json("Attendee does not exist");
            }

            // Cost variables set to 0
            let eventCost = 0, housingCost = 0, restaurantCost = 0;

            // Get the sum of the events cost as long as they are attending atleast one event
            if(attendee.attending.events.length > 0) {
                const eventIds = Object.values(attendee.attending.events);
                const events = await Event.find(({ _id : { $in: eventIds } }));
                const sumCost = await events.reduce(async (sum, event) => {
                    return sum + event.cost;
                }, 0);
                eventCost += sumCost;
            }

            // Get the sum of the housings cost as long as they are attending atleast one housing
            if(attendee.attending.housings.length > 0) {
                housingCost = await attendee.attending.housings.reduce(async (sum, housingId) => {
                    const housing = await Housing.findById(housingId);
                    return sum + housing.cost;
                }, 0);
            }
            
            // Get the sum of the restaurants cost as long as they are attending atleast one restaurant
            if(attendee.attending.restaurants.length > 0) {
                restaurantCost = await attendee.attending.restaurants.reduce(async (sum, restaurantId) => {
                    const restaurant = await Restaurant.findById(restaurantId);
                    return sum + restaurant.cost;
                }, 0);
            }

            // Save the sum of events, housings, and restaurants cost into attendee's personal cost
            attendee.personalCost = eventCost + housingCost + restaurantCost;
            console.log(eventCost, housingCost, restaurantCost)

            // Save updated attendee in the database
            await attendee.save();

            // Return successful
            return res.status(200).json(attendee);

        } catch (err) {
            //console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

// Route    PUT api/attendee/:tripId/:userId
// Desc     Update a user into the trip's attendees
// Access   Private
Router.put(
    "/:tripId/:userId",
    authMiddleware,
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
           
            // Find attendee data in the database
            let attendee = await Attendee.findOne({tripId: tripId, userId: userId});

            // If attendee does not exist, return failure
            if(!attendee) {
                return res.status(401).json("Attendee does not exist");
            }

            // Update attendee's attending list
            attending ? attendee.attending = attending : null;

            // Save updated attendee into the database
            await attendee.save();

            // Update attendee's personal cost
            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}/personalcost`, {}, { headers: { "token": req.header("token") } });

            // Return successful
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

            // If attendee does not exist, return failure
            if(!attendee) {
                return res.status(404).json("Attendee does not exist");
            }

            // Change the moderator status of this attendee
            attendee.moderator = !attendee.moderator

            // Save into the attendee database
            await attendee.save();

            // Return successful
            return res.status(200).json(attendee)
            
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    DELETE api/attendee/:tripId/:userId
// Desc     Remove a user into the trip's attendees
// Access   Private
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

            // If attendee does not exist, return failure
            if(!attendee) {
                return res.status(404).json("User is not attending this trip")
            }

            // Find the trip in the trip database
            let trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).json("Trip does not exist")
            }

            // Remove attendee from the trip's attendee list
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

            // Remove attendee from the database
            await attendee.remove();

            // Return successful
            return res.status(200).json("Attendee has been removed");

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
);

module.exports = Router;