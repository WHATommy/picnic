const express = require("express");
const Router = express.Router();
const Trip = require("../models/TripModel");
const Restaurants = require("../models/RestaurantModel");
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");
const validateRestaurantInput = require("../validator/restaurant");
const axios = require("axios");
const baseUrl = require("../util/baseUrl");
const Attendee = require("../models/AttendeeModel");
const cloudinary = require("../util/cloudinary");
const upload = require("../util/mutler");

// Route    POST api/restaurant/:tripId
// Desc     Create a restaurant for a trip
// Access   Private
Router.post(
    "/:tripId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isAttendee,
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

// Route    GET api/restaurant/:tripId/:restaurantId
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

// Route    GET api/restaurant/:tripId
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

// Route    PUT api/restaurant/:tripId/:restaurantId/:userId/join
// Desc     User joins a restaurant
// Access   Private
Router.put(
    "/:tripId/:restaurantId/:userId/join",
    authMiddleware,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            restaurantId,
            userId
        } = req.params

        try {
            let trip = await Trip.findById(tripId);
            // Check if restaurant exist in the database
            if (!trip) {
                return res.status(404).send("Trip does not exist");
            };
            // Retrieve a restaurant by ID
            let restaurant = await Restaurants.findById(restaurantId);
            // Check if restaurant exist in the database
            if (!restaurant) {
                return res.status(404).send("Restaurant does not exist");
            };

            // Check if attendee is already attending this restaurant
            let isAttending = restaurant.attendees.find(attendeeId => attendeeId._id.valueOf() === userId)
            if(isAttending) {
                return res.status(401).json("Attendee is already in this restaurant")
            }

            // Update the restaurant attendees
            restaurant.attendees.unshift(userId);
            // Save the restaurant
            await restaurant.save();

            // Update the attendee's attending list
            const attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            if(!attendee) {
                return res.status(404).send("Attendee does not exist");
            }

            // Check if attendee is already attending this restaurant
            isAttending = attendee.attending.restaurants.find(restaurant => restaurant._id.valueOf() === restaurantId);
            if(isAttending) {
                return res.status(401).json("User is already attending this restaurant")
            }

            // Add restaurant into the attendee's attending list
            attendee.attending.restaurants.unshift(restaurantId);

            // PUT request to attendee api
            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}`, { attending: attendee.attending }, { headers: { "token": req.header("token") } });

            return res.status(200).json(restaurant);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/restaurant/:tripId/:restaurantId/:userId/leave
// Desc     User leaves a restaurant
// Access   Private
Router.put(
    "/:tripId/:restaurantId/:userId/leave",
    authMiddleware,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            restaurantId,
            userId
        } = req.params

        try {
            let trip = await Trip.findById(tripId);
            // Check if restaurant exist in the database
            if (!trip) {
                return res.status(404).send("Trip does not exist");
            };
            // Retrieve a restaurant by ID
            let restaurant = await Restaurants.findById(restaurantId);
            // Check if restaurant exist in the database
            if (!restaurant) {
                return res.status(404).send("Restaurant does not exist");
            };

            // Check if attendee is already attending this restaurant
            const user = restaurant.attendees.find(attendee => attendee._id.valueOf() === userId);
            if(!user) {
                return res.status(401).json("User is not attending this restaurant");
            }

            // Remove the attendee
            restaurant.attendees = restaurant.attendees.filter(attendee => attendee._id.valueOf() !== userId);
            
            // Save the restaurant
            await restaurant.save();

            // Update the attendee's attending list
            const attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            if(!attendee) {
                return res.status(404).send("Attendee does not exist");
            }

            // Check if attendee is already attending this restaurant
            isAttending = attendee.attending.restaurants.find(restaurant => restaurant._id.valueOf() === restaurantId);
            if(!isAttending) {
                return res.status(401).json("User is not attending this restaurant")
            }

            // Remove the restaurant from the attendee attending list
            attendee.attending.restaurants = attendee.attending.restaurants.filter(restaurant => restaurant._id.valueOf() !== restaurantId);

            // Update the attendee
            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}`, { attending: attendee.attending }, { headers: { "token": req.header("token") } });
           
            return res.status(200).json(restaurant);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/restaurant/:tripId/:restaurantId
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

// Route    PUT api/restaurant/:tripId/:restaurantId/uploadImage
// Desc     Upload a restaurant image
// Access   Private
Router.put(
    "/:tripId/:restaurantId/uploadImage",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster || tripMiddleware.isAttendee,
    upload.single("image"),
    async(req, res) => {
        // Store request values into callable variables
        const {
            restaurantId
        } = req.params

        try {
            // Retrieve a restaurant by ID
            let restaurant = await Restaurants.findById(restaurantId);

            // Check if restaurant exist in the database
            if (!restaurant) {
                return res.status(404).send("Restaurants does not exist");
            }

            // Check if a image file exist in the request
            if(!req.file.path) {
                return res.status(401).send("Empty image file");
            }

            // Upload image to cloudinary
            let cloudinaryResult = null;
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

            // Push new image into restaurant's images
            restaurant.images.push({
                image: cloudinaryResult.secure_url,
                cloudinaryId: cloudinaryResult.public_id
            })

            // Save the restaurant
            await restaurant.save();

            // Return successful
            return res.status(200).json(restaurant);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/restaurant/:tripId/:restaurantId/removeImage
// Desc     Remove a restaurant image
// Access   Private
Router.put(
    "/:tripId/:restaurantId/:imageId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster || tripMiddleware.isAttendee,
    upload.single("image"),
    async(req, res) => {
        // Store request values into callable variables
        const {
            restaurantId,
            imageId
        } = req.params

        try {
            // Retrieve a restaurant by ID
            let restaurant = await Restaurants.findById(restaurantId);

            // Check if restaurant exist in the database
            if (!restaurant) {
                return res.status(404).send("Restaurants does not exist");
            };

            // Remove restaurant image from cloudinary
            await cloudinary.uploader.destroy(imageId);

            // Remove target image
            restaurant.images = restaurant.images.filter(image => image.cloudinaryId !== imageId);
            
            // Save the restaurant
            await restaurant.save();

            // Return successful
            return res.status(200).json(restaurant);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    DELETE api/restaurant/:tripId/:restaurantId
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

            // Filter out the restaurant from the trip's list of restaurants
            trip.restaurants = trip.restaurants.filter(restaurantId => restaurantId.valueOf() !== restaurant._id.valueOf());

            // Update trip's restaurants
            await axios.put(`${baseUrl}/trip/${tripId}`, { restaurants: trip.restaurants }, { headers: { "token": req.header("token") } });

            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            // Remove restaurant's images from cloudinary
            housing.images.forEach(async image => {
                await cloudinary.uploader.destroy(image.cloudinaryId);
            });

            // Remove restaurant from database
            await restaurant.remove();

            // Return successful
            return res.status(200).send("Restaurants has been removed");

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/restaurant/:tripId/:restaurantId/uploadImage
// Desc     Upload a restaurant image
// Access   Private
Router.put(
    "/:tripId/:restaurantId/uploadImage",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster || tripMiddleware.isAttendee,
    upload.single("image"),
    async(req, res) => {
        // Store request values into callable variables
        const {
            restaurantId
        } = req.params

        try {
            // Retrieve a restaurant by ID
            let restaurant = await Restaurants.findById(restaurantId);

            // Check if restaurant exist in the database
            if (!restaurant) {
                return res.status(404).send("Restaurants does not exist");
            }

            // Check if a image file exist in the request
            if(!req.file) {
                return res.status(401).send("Empty image file");
            }

            // Upload image to cloudinary
            let cloudinaryResult = null;
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

            // Push new image into restaurant's images
            restaurant.images.push({
                image: cloudinaryResult.secure_url,
                cloudinaryId: cloudinaryResult.public_id
            })

            // Save the restaurant
            await restaurant.save();

            // Return successful
            return res.status(200).json(restaurant);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/restaurant/:tripId/:restaurantId/removeImage
// Desc     Remove a restaurant image
// Access   Private
Router.put(
    "/:tripId/:restaurantId/:imageId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster || tripMiddleware.isAttendee,
    upload.single("image"),
    async(req, res) => {
        // Store request values into callable variables
        const {
            restaurantId,
            imageId
        } = req.params

        try {
            // Retrieve a restaurant by ID
            let restaurant = await Restaurants.findById(restaurantId);

            // Check if restaurant exist in the database
            if (!restaurant) {
                return res.status(404).send("Restaurants does not exist");
            };

            // Remove restaurant image from cloudinary
            await cloudinary.uploader.destroy(imageId);

            // Remove target image
            restaurant.images = restaurant.images.filter(image => image.cloudinaryId !== imageId);
            
            // Save the restaurant
            await restaurant.save();

            // Return successful
            return res.status(200).json(restaurant);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;