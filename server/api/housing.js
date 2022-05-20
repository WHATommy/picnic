const express = require("express");
const Router = express.Router();
const Trip = require("../models/TripModel");
const Housings = require("../models/HousingModel");
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");
const validateHousingInput = require("../validator/housing");
const axios = require("axios");
const baseUrl = require("../util/baseUrl");
const Attendee = require("../models/AttendeeModel");
const cloudinary = require("../util/cloudinary");
const upload = require("../util/mutler");

// Route    POST api/housing/:tripId
// Desc     Create a housing for a trip
// Access   Private
Router.post(
    "/:tripId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isAttendee,
    async (req, res) => {
        // Validate request inputs
        const { errors, isValid } = await validateHousingInput(req.body);
                
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
            poster,
            name,
            location,
            description,
            startDate,
            endDate,
            cost,
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
            let newHousing = new Housings({
                tripId,
                image,
                poster,
                name,
                location,
                description,
                startDate,
                endDate,
                cost,
                websiteUrl,
                attendees
            });

            // Save the housing in the 'housing' collection and the housing id into the trip's list of housings
            await newHousing.save().then(housing => {
                trip.housings.unshift(housing._id);
            });

            // Update trip's housing
            await axios.put(`${baseUrl}/trip/${tripId}`, { housings: trip.housings }, { headers: { "token": req.header("token") } });
            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            return res.status(200).json(newHousing);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    GET api/housing/:tripId/:housingId
// Desc     Retrieve information about a housing of a trip
// Access   Private
Router.get(
    "/:tripId/:housingId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isAttendee,
    async(req, res) => {
        // Store request values into callable variables
        const {
            housingId
        } = req.params;

        // Find a housing inside the database
        const housing = await Housings.findById(housingId);

        if(!housing) {
            return res.status(404).send("Housings does not exist");
        }

        return res.status(200).json(housing);
    }
)

// Route    GET api/housing/:tripId
// Desc     Retrieve all of the trip's housings
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
        const tripHousings = await Housings.find( { _id: { $in: trip.housings } } );

        return res.status(200).json(tripHousings);
    }
)

// Route    PUT api/housing/:tripId/:housingId/:userId/join
// Desc     User joins a housing
// Access   Private
Router.put(
    "/:tripId/:housingId/:userId/join",
    authMiddleware,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            housingId,
            userId
        } = req.params

        try {
            let trip = await Trip.findById(tripId);
            // Check if housing exist in the database
            if (!trip) {
                return res.status(404).send("Trip does not exist");
            };
            // Retrieve a housing by ID
            let housing = await Housings.findById(housingId);
            // Check if housing exist in the database
            if (!housing) {
                return res.status(404).send("Housing does not exist");
            };

            // Check if attendee is already attending this housing
            let isAttending = housing.attendees.find(attendeeId => attendeeId._id.valueOf() === userId)
            if(isAttending) {
                return res.status(401).json("Attendee is already in this housing")
            }

            // Update the housing attendees
            housing.attendees.unshift(userId);
            // Save the housing
            await housing.save();

            // Update the attendee's attending list
            const attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            if(!attendee) {
                return res.status(404).send("Attendee does not exist");
            }

            // Check if attendee is already attending this housing
            isAttending = attendee.attending.housings.find(housing => housing._id.valueOf() === housingId);
            if(isAttending) {
                return res.status(401).json("User is already attending this housing")
            }

            // Add housing into the attendee's attending list
            attendee.attending.housings.unshift(housingId);

            // PUT request to attendee api
            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}`, { attending: attendee.attending }, { headers: { "token": req.header("token") } });

            return res.status(200).json(housing);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/housing/:tripId/:housingId/:userId/leave
// Desc     User leaves a housing
// Access   Private
Router.put(
    "/:tripId/:housingId/:userId/leave",
    authMiddleware,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            housingId,
            userId
        } = req.params

        try {
            let trip = await Trip.findById(tripId);
            // Check if housing exist in the database
            if (!trip) {
                return res.status(404).send("Trip does not exist");
            };
            // Retrieve a housing by ID
            let housing = await Housings.findById(housingId);
            // Check if housing exist in the database
            if (!housing) {
                return res.status(404).send("Housing does not exist");
            };

            // Check if attendee is already attending this housing
            const user = housing.attendees.find(attendee => attendee._id.valueOf() === userId);
            if(!user) {
                return res.status(401).json("User is not attending this housing");
            }

            // Remove the attendee
            housing.attendees = housing.attendees.filter(attendee => attendee._id.valueOf() !== userId);
            // Save the housing
            await housing.save();

            // Update the attendee's attending list
            const attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            if(!attendee) {
                return res.status(404).send("Attendee does not exist");
            }

            // Check if attendee is already attending this housing
            isAttending = attendee.attending.housings.find(housing => housing._id.valueOf() === housingId);
            if(!isAttending) {
                return res.status(401).json("User is not attending this housing")
            }

            // Remove the housing from the attendee attending list
            attendee.attending.housings = attendee.attending.housings.filter(housing => housing._id.valueOf() !== housingId);

            // Update the attendee
            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}`, { attending: attendee.attending }, { headers: { "token": req.header("token") } });
           
            return res.status(200).json(housing);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/housing/:tripId/:housingId
// Desc     Update a housing
// Access   Private
Router.put(
    "/:tripId/:housingId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster,
    async(req, res) => {
        // Store request values into callable variables
        const {
            housingId
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
            // Retrieve a housing by ID
            let housing = await Housings.findById(housingId);

            // Check if housing exist in the database
            if (!housing) {
                return res.status(404).send("Housings does not exist");
            }

            // Update the housing structure
            name ? housing.name = name : null;
            location ? housing.location = location : null;
            rating ? housing.rating = rating : null;
            startDate ? housing.startDate = startDate : null;
            endDate ? housing.endDate = endDate : null;
            cost ? housing.cost = cost : null;
            categories ? housing.categories = categories : null;
            phoneNumber ? housing.phoneNumber = phoneNumber : null;
            websiteUrl ? housing.websiteUrl = websiteUrl : null;
            images ? housing.image = image : null;
            attendees ? housing.attendees = attendees : null;

            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            // Save the housing
            await housing.save();

            return res.status(200).json(housing);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
        
    }
)

// Route    PUT api/housing/:tripId/:housingId/uploadImage
// Desc     Upload a housing image
// Access   Private
Router.put(
    "/:tripId/:housingId/uploadImage",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster || tripMiddleware.isAttendee,
    upload.single("image"),
    async(req, res) => {
        // Store request values into callable variables
        const {
            housingId
        } = req.params

        try {
            // Retrieve a housing by ID
            let housing = await Housings.findById(housingId);

            // Check if housing exist in the database
            if (!housing) {
                return res.status(404).send("Housings does not exist");
            }

            // Check if a image file exist in the request
            if(!req.file) {
                return res.status(401).send("Empty image file");
            }

            // Upload image to cloudinary
            let cloudinaryResult = null;
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

            // Push new image into housing's images
            housing.images.push({
                image: cloudinaryResult.secure_url,
                cloudinaryId: cloudinaryResult.public_id
            })

            // Save the housing
            await housing.save();

            // Return successful
            return res.status(200).json(housing);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/housing/:tripId/:housingId/removeImage
// Desc     Remove a housing image
// Access   Private
Router.put(
    "/:tripId/:housingId/:imageId",
    authMiddleware,
    tripMiddleware.isOwner || tripMiddleware.isModerator || tripMiddleware.isPoster || tripMiddleware.isAttendee,
    upload.single("image"),
    async(req, res) => {
        // Store request values into callable variables
        const {
            housingId,
            imageId
        } = req.params

        try {
            // Retrieve a housing by ID
            let housing = await Housings.findById(housingId);

            // Check if housing exist in the database
            if (!housing) {
                return res.status(404).send("Housings does not exist");
            };

            // Remove housing image from cloudinary
            await cloudinary.uploader.destroy(imageId);

            // Remove target image
            housing.images = housing.images.filter(image => image.cloudinaryId !== imageId);
            
            // Save the housing
            await housing.save();

            // Return successful
            return res.status(200).json(housing);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    DELETE api/housing/:tripId/:housingId
// Desc     Remove a housing
// Access   Private
Router.delete(
    "/:tripId/:housingId",
    authMiddleware,
    tripMiddleware.isOwner,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            housingId
        } = req.params

        try {
            // Find a trip inside the database
            const trip = await Trip.findById(tripId);
            if(!trip) {
                return res.status(404).send("Trip does not exist");
            }

            // Find a housing inside the database
            const housing = await Housings.findById(housingId);
            if(!housing) {
                return res.status(404).send("Housings does not exist");
            }

            trip.housings = trip.housings.filter(housingId => housingId.valueOf() !== housing._id.valueOf());

            // Update trip's housing
            await axios.put(`${baseUrl}/trip/${tripId}`, { housings: trip.housings }, { headers: { "token": req.header("token") } });

            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            // Remove housing images from cloudinary
            housing.images.forEach(async image => {
                await cloudinary.uploader.destroy(image.cloudinaryId);
            });

            // Remove housing from database
            await housing.remove();

            return res.status(200).send("Housings has been removed");

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;