const express = require("express");
const Router = express.Router();
const Trip = require("../models/TripModel");
const User = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");
const validateTripInput = require("../validator/trip");
const axios = require("axios");
const baseUrl = require("../util/baseUrl");
const trip = require("../validator/trip");

// Route    POST api/trip
// Desc     Create a trip
// Access   Private
Router.post(
    "/",
    authMiddleware,
    async(req, res) => {
        // Validate request inputs
        const { errors, isValid } = await validateTripInput(req.body);
                
        // Check validations
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Store request values into callable variables
        const {
            name,
            location,
            startDate,
            endDate
        } = req.body;

        try {
            // Find the user inside the database
            const user = await User.findById(req.user);
            
            // Trip structure
            const newTrip = new Trip({
                owner: req.user,
                name,
                location,
                startDate,
                endDate,
                events: [],
                restaurants: [],
                housings: [],
                attendees: []
            });

            // Save the trip in the 'trip' collection and the trip id into the user's list of trips
            await newTrip.save().then(trip => {
                user.trips.unshift(trip._id);
                user.save().then(res.status(200).json(trip));
            });

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    } 
)

// Route    GET api/trip/:tripId
// Desc     Retrieve a trip's information
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

        try {
            const trip = await Trip.findById(tripId);

            if(!trip) {
                return res.status(404).send("The trip does not exist");
            }

            return res.status(200).json(trip);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    GET api/trip
// Desc     Retrieve all of the user's trips
// Access   Private
Router.get(
    "/",
    authMiddleware,
    async(req, res) => {
        try {
            // Find the user inside the database
            const user = await User.findById(req.user);

            // User does not exist
            if(!user) {
                return res.status(404).send("User does not exist");
            };

            // Find each of the trip's infomation in the user's trips list
            const userTrips = await Trip.find( { _id: { $in: user.trips } } );
            
            return res.status(200).json(userTrips)
            
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/trip/:tripId
// Desc     Update a trip's information
// Access   Private
Router.put(
    "/:tripId",
    authMiddleware,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId
        } = req.params
        const {
            owner,
            name,
            location,
            startDate,
            endDate,
            events,
            restaurants,
            housings,
            attendees,
            pendingUsers
        } = req.body;

        try {
            // Find the user inside the database
            let trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).send("The trip does not exist");
            };

            // Updated trip structure
            owner ? trip.owner = owner : null
            name ? trip.name = name : null
            location ? trip.location = location : null
            startDate ? trip.startDate = startDate : null
            endDate ? trip.endDate = endDate : null
            events ? trip.events = events : null
            restaurants ? trip.restaurants = restaurants : null
            housings ? trip.housings = housings : null
            attendees ? trip.attendees = attendees : null
            pendingUsers ? trip.pendingUsers = pendingUsers : null

            console.log(trip)

            // Save the trip in the 'trip' collection and the trip id into the user's list of trips
            await trip.save();
            
            return res.status(200).json(trip);
            
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    GET api/trip/:tripId/cost
// Desc     Update a trip's total cost
// Access   Private
Router.put(
    "/:tripId/cost",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isAttendee,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId
        } = req.params;

        try {
            const trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).send("The trip does not exist");
            }
            
            const restaurants = await axios.get(`${baseUrl}/restaurant/${tripId}`, { headers: { "token": req.header("token") } });
            const restaurantCost = restaurants.data.reduce((sum, restaurant) => {
                return sum += restaurant.cost;
            }, 0);

            const housings = await axios.get(`${baseUrl}/housing/${tripId}`, { headers: { "token": req.header("token") } });
            const housingCost = housings.data.reduce((sum, housing) => {
                return sum += housing.cost;
            }, 0);

            const events = await axios.get(`${baseUrl}/event/${tripId}`, { headers: { "token": req.header("token") } });
            const eventCost = events.data.reduce((sum, event) => {
                return sum += event.cost;
            }, 0);

            trip.cost = restaurantCost + housingCost + eventCost

            trip.save();
            
            return res.status(200).json(trip);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/trip/:tripId/:userId
// Desc     Update a trip's moderator
// Access   Private
Router.put(
    "/:tripId/:userId",
    authMiddleware,
    tripMiddleware.isOwner,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            userId
        } = req.params;

        try {
            // Find the user inside the database
            let trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).send("The trip does not exist");
            };

            // Updated trip attendee structure
            let attendeeIndex = await trip.attendees.findIndex(attendee => attendee._id.valueOf() === userId.valueOf());

            // If attendee is not found, return error
            if(attendeeIndex === -1) {
                return res.status(404).send("User is not a attendee in the trip");
            }

            // Change moderator permission for target user
            const permission = !trip.attendees[attendeeIndex].moderator;
            trip.attendees[attendeeIndex].moderator = permission;
            
            // Save the trip in the 'trip' collection and the trip id into the user's list of trips
            await trip.save();
            
            return res.status(200).json(trip);
            
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)


// Route    DELETE api/trip/:tripId
// Desc     Delete a trip
// Access   Private
Router.delete(
    "/:tripId",
    authMiddleware,
    tripMiddleware.isOwner,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId
        } = req.params;
        
        try {
            // Find the user inside the database
            let trip = await Trip.findById(tripId);

            // User does not exist
            if(!trip) {
                return res.status(404).send("The trip does not exist");
            };

            // Remove the trip id from the owner's and attendee's trips list
            const users = [trip.owner, ...trip.attendees];
            await users.map(userId => {
                let userTrips;
                User.findById(userId)
                .then(user => {
                    userTrips = user.trips.filter(userTrip => userTrip._id.valueOf() != trip._id.valueOf());
                })
                .then(() => {
                    axios.put(`${baseUrl}/api/user`, { userId, trips: userTrips }, { headers: { "token": req.header("token") } });
                })
            });

            // Remove the trip from the database
            await trip.remove()
            
            return res.status(200).json("Trip has been removed");
            
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;