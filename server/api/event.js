const express = require("express");
const Router = express.Router();
const Trip = require("../models/TripModel");
const Events = require("../models/EventModel");
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");
const validateEventInput = require("../validator/event");
const axios = require("axios");
const baseUrl = require("../util/baseUrl");

// Route    POST api/event/:tripId
// Desc     Create a event for a trip
// Access   Private
Router.post(
    "/:tripId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isAttendee,
    async (req, res) => {
        // Validate request inputs
        const { errors, isValid } = await validateEventInput(req.body);
                
        // Check validations
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Store request values into callable variables
        const {
            tripId
        } = req.params;
        const {
            image,
            name,
            location,
            startDate,
            endDate,
            cost,
            description,
            phoneNumber,
            websiteUrl,
            attendees
        } = req.body;

        try {
            // Query the trip and see if it exists
            const trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).send("The trip does not exist");
            }

            // Trip structure
            let newEvent = new Events({
                tripId,
                image,
                poster: req.user,
                name,
                location,
                startDate,
                endDate,
                cost,
                description,
                phoneNumber,
                websiteUrl,
                attendees
            });

            // Save the event in the 'event' collection and the event id into the trip's list of events
            await newEvent.save().then(event => {
                trip.events.unshift(event._id);
            });

            // Update trip's events
            await axios.put(`${baseUrl}/trip/${tripId}`, { events: trip.events }, { headers: { "token": req.header("token") } });
            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            return res.status(200).json(newEvent);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    GET api/event/:tripId/:eventId
// Desc     Retrieve information about a event of a trip
// Access   Privates
Router.get(
    "/:tripId/:eventId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isAttendee,
    async(req, res) => {
        // Store request values into callable variables
        const {
            eventId
        } = req.params;

        // Find a event inside the database
        const event = await Events.findById(eventId);

        if(!event) {
            return res.status(404).send("Events does not exist");
        }

        return res.status(200).json(event);
    }
)

// Route    GET api/event/:tripId
// Desc     Retrieve all of the trip's events
// Access   Private
Router.get(
    "/:tripId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isAttendee,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId
        } = req.params;

        // Find the trip inside the database
        const trip = await Trip.findById(tripId);
        
        if(!trip) {
            return res.status(404).send("Trip does not exist");
        }

        // Find each of the trip's infomation in the user's trips list
        const tripEvents = await Events.find( { _id: { $in: trip.events } } );

        return res.status(200).json(tripEvents);
    }
)

// Route    PUT api/event/:tripId/:eventId
// Desc     Update a event
// Access   Private
Router.put(
    "/:tripId/:eventId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster,
    async(req, res) => {
        // Validate request inputs
        const { errors, isValid } = await validateEventInput(req.body);
                
        // Check validations
        if (!isValid) {
            return res.status(400).json(errors);
        }
        // Store request values into callable variables
        const {
            tripId,
            eventId
        } = req.params
        const {
            image,
            name,
            location,
            startDate,
            endDate,
            cost,
            description,
            phoneNumber,
            websiteUrl,
            attendees
        } = req.body;

        try {
            // Retrieve a event by ID
            let event = await Events.findById(eventId);

            // Check if event exist in the database
            if (!event) {
                return res.status(404).send("Events does not exist");
            }

            // Update the event structure
            image ? event.image = image : null;
            name ? event.name = name : null;
            location ? event.location = location : null;
            startDate ? event.startDate = startDate : null;
            endDate ? event.endDate = endDate : null;
            cost ? event.cost = cost : null;
            description ? event.description = description : null;
            phoneNumber ? event.phoneNumber = phoneNumber : null;
            websiteUrl ? event.websiteUrl = websiteUrl : null;
            attendees ? event.attendees = attendees : null;

            // Save the event
            await event.save();

            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            return res.status(200).json(event);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
        
    }
)

// Route    DELETE api/event/:tripId/:eventId
// Desc     Remove a event
// Access   Private
Router.delete(
    "/:tripId/:eventId",
    authMiddleware,
    tripMiddleware.isOwner,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            eventId
        } = req.params

        try {
            // Find a trip inside the database
            const trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).send("Trip does not exist");
            }

            // Find a event inside the database
            const event = await Events.findById(eventId);
            if(!event) {
                return res.status(404).send("Events does not exist");
            }

            trip.events = trip.events.filter(eventId => eventId.valueOf() !== event._id.valueOf());

            // Update trip's events
            await axios.put(`${baseUrl}/trip/${tripId}`, { events: trip.events }, { headers: { "token": req.header("token") } });
            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            await event.remove();

            return res.status(200).send("Events has been removed");

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;