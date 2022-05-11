const express = require("express");
const Router = express.Router();
const Trip = require("../models/TripModel");
const Restaurants = require("../models/RestaurantModel");
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");
const validateRestaurantInput = require("../validator/restaurant");
const axios = require("axios");
const baseUrl = require("../util/baseUrl");

// Route    POST api/restaurant/
// Desc     Create a restaurant for a trip
// Access   Private
Router.post(
    "/:tripId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator,
    async (req, res) => {
        // Validate request inputs
        const { errors, isValid } = await validateRestaurantInput(req.body);
                
        // Check validations
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Store request values into callable variables
        const {
            tripId
        } = req.params;
        const {
            poster,
            name,
            location,
            rating,
            startDate,
            endDate,
            cost,
            categories,
            phoneNumber,
            websiteUrl,
            images,
            attendees
        } = req.body;

        try {
            // Query the trip and see if it exists
            const trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).send("The trip does not exist");
            }

            // Trip structure
            let newRestaurant = new Restaurants({
                tripId,
                attendees,
                poster,
                name,
                location,
                rating,
                startDate,
                endDate,
                cost,
                categories,
                phoneNumber,
                websiteUrl,
                images
            });

            // Save the restaurant in the 'restaurant' collection and the restaurant id into the trip's list of restaurants
            await newRestaurant.save().then(restaurant => {
                trip.restaurants.unshift(restaurant._id);
            });

            // Update trip's restaurants
            await axios.put(`${baseUrl}/trip/${tripId}`, { restaurants: trip.restaurants }, { headers: { "token": req.header("token") } });
            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            return res.status(200).json(newRestaurant);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    GET api/restaurant/
// Desc     Retrieve information about a restaurant of a trip
// Access   Private
Router.get(
    "/:tripId/:restaurantId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isAttendee,
    async(req, res) => {
        // Store request values into callable variables
        const {
            restaurantId
        } = req.params;

        // Find a restaurant inside the database
        const restaurant = await Restaurants.findById(restaurantId);

        if(!restaurant) {
            return res.status(404).send("Restaurants does not exist");
        }

        return res.status(200).json(restaurant);
    }
)

// Route    GET api/restaurant
// Desc     Retrieve all of the trip's restaurants
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
        const tripRestaurants = await Restaurants.find( { _id: { $in: trip.restaurants } } );

        return res.status(200).json(tripRestaurants);
    }
)

// Route    PUT api/restaurant
// Desc     Update a restaurant
// Access   Private
Router.put(
    "/:tripId/:restaurantId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster,
    async(req, res) => {  
        // Store request values into callable variables
        const {
            restaurantId
        } = req.params
        const {
            name,
            location,
            rating,
            startDate,
            endDate,
            cost,
            categories,
            phoneNumber,
            websiteUrl,
            images,
            attendees
        } = req.body;

        try {
            // Retrieve a restaurant by ID
            let restaurant = await Restaurants.findById(restaurantId);

            // Check if restaurant exist in the database
            if (!restaurant) {
                return res.status(404).send("Restaurants does not exist");
            }

            // Update the restaurant structure
            name ? restaurant.name = name : null;
            location ? restaurant.location = location : null;
            rating ? restaurant.rating = rating : null;
            startDate ? restaurant.startDate = startDate : null;
            endDate ? restaurant.endDate = endDate : null;
            cost ? restaurant.cost = cost : null;
            categories ? restaurant.categories = categories : null;
            phoneNumber ? restaurant.phoneNumber = phoneNumber : null;
            websiteUrl ? restaurant.websiteUrl = websiteUrl : null;
            images ? restaurant.image = image : null;
            attendees ? restaurant.attendees = attendees : null;

            // Save the restaurant
            await restaurant.save();

            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            return res.status(200).json(restaurant);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
        
    }
)

// Route    DELETE api/restaurant
// Desc     Remove a restaurant
// Access   Private
Router.delete(
    "/:tripId/:restaurantId",
    authMiddleware,
    tripMiddleware.isOwner,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            restaurantId
        } = req.params

        try {
            // Find a trip inside the database
            const trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).send("Trip does not exist");
            }

            // Find a restaurant inside the database
            const restaurant = await Restaurants.findById(restaurantId);
            if(!restaurant) {
                return res.status(404).send("Restaurants does not exist");
            }

            trip.restaurants = trip.restaurants.filter(restaurantId => restaurantId.valueOf() !== restaurant._id.valueOf());

            // Update trip's restaurants
            await axios.put(`${baseUrl}/trip/${tripId}`, { restaurants: trip.restaurants }, { headers: { "token": req.header("token") } });
            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            await restaurant.remove();

            return res.status(200).send("Restaurants has been removed");

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;