const express = require("express");
const Router = express.Router();
const Trip = require("../models/TripModel");
const Events = require("../models/EventModel");
const authMiddleware = require("../middleware/authMiddleware");
const tripMiddleware = require("../middleware/tripMiddleware");
const validateEventInput = require("../validator/event");
const axios = require("axios");
const baseUrl = require("../util/baseUrl");
const Attendee = require("../models/AttendeeModel");
const cloudinary = require("../util/cloudinary");
const upload = require("../util/mutler");

// Route    POST api/event/:tripId
// Desc     Create a event for a trip
// Access   Private
Router.post(
    "/:tripId",
    authMiddleware,
    tripMiddleware.isAttendee,
    upload.single("image"),
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
            await newEvent.save().then(async event => {
                await trip.events.unshift(event._id);
                if(image) {
                    await axios.put(`${baseUrl}/event/${tripId}/${event._id}/uploadImage`, { image }, { headers: { "token": req.header("token") } });
                }
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
    tripMiddleware.isAttendee,
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
    tripMiddleware.isAttendee,
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

// Route    PUT api/event/:tripId/:eventId/:userId/join
// Desc     User joins a event
// Access   Private
Router.put(
    "/:tripId/:eventId/:userId/join",
    authMiddleware,
    tripMiddleware.isAttendee,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            eventId,
            userId
        } = req.params

        try {
            let trip = await Trip.findById(tripId);
            // Check if event exist in the database
            if (!trip) {
                return res.status(404).send("Trip does not exist");
            };
            
            // Retrieve a event by ID
            let event = await Events.findById(eventId);
            // Check if event exist in the database
            if (!event) {
                return res.status(404).send("Event does not exist");
            };

            // Check if attendee is already attending this event
            let isAttending = event.attendees.find(attendeeId => attendeeId._id.valueOf() === userId)
            if(isAttending) {
                return res.status(401).json("Attendee is already in this event")
            }
            
            // Update the event attendees
            event.attendees.unshift(userId);
            // Save the event
            await event.save();

            // Update the attendee's attending list
            const attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            if(!attendee) {
                return res.status(404).send("Attendee does not exist");
            }

            // Check if attendee is already attending this event
            isAttending = attendee.attending.events.find(event => event._id.valueOf() === eventId);
            if(isAttending) {
                return res.status(401).json("User is already attending this event")
            }

            // Add event into the attendee's attending list
            attendee.attending.events.unshift(eventId);

            // PUT request to attendee api
            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}`, { attending: attendee.attending }, { headers: { "token": req.header("token") } });

            return res.status(200).json(event);
        } catch (err) {
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/event/:tripId/:eventId/:userId/leave
// Desc     User leaves a event
// Access   Private
Router.put(
    "/:tripId/:eventId/:userId/leave",
    authMiddleware,
    tripMiddleware.isAttendee,
    async(req, res) => {
        // Store request values into callable variables
        const {
            tripId,
            eventId,
            userId
        } = req.params

        try {
            let trip = await Trip.findById(tripId);
            // Check if event exist in the database
            if (!trip) {
                return res.status(404).send("Trip does not exist");
            };
            // Retrieve a event by ID
            let event = await Events.findById(eventId);
            // Check if event exist in the database
            if (!event) {
                return res.status(404).send("Event does not exist");
            };

            // Check if attendee is already attending this event
            const user = event.attendees.find(attendee => attendee._id.valueOf() === userId);
            if(!user) {
                return res.status(401).json("User is not attending this event");
            }

            // Remove the attendee
            event.attendees = event.attendees.filter(attendee => attendee._id.valueOf() !== userId);
            // Save the event
            await event.save();

            // Update the attendee's attending list
            const attendee = await Attendee.findOne({tripId: tripId, userId: userId});
            if(!attendee) {
                return res.status(404).send("Attendee does not exist");
            }

            // Check if attendee is already attending this event
            isAttending = attendee.attending.events.find(event => event._id.valueOf() === eventId);
            if(!isAttending) {
                return res.status(401).json("User is not attending this event");
            }

            // Remove the event from the attendee attending list
            attendee.attending.events = attendee.attending.events.filter(event => event._id.valueOf() !== eventId);

            // Update the attendee
            await axios.put(`${baseUrl}/attendee/${tripId}/${userId}`, { attending: attendee.attending }, { headers: { "token": req.header("token") } });
           
            return res.status(200).json(event);
        } catch (err) {
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/event/:tripId/:eventId
// Desc     Update a event
// Access   Private
Router.put(
    "/:tripId/:eventId",
    authMiddleware,
    tripMiddleware.isAttendee,
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

            // Update image
            if(image) {
                await axios.put(`${baseUrl}/event/${tripId}/${event._id}/uploadImage`, { image }, { headers: { "token": req.header("token") } });
            }

            return res.status(200).json(event);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/event/:tripId/:eventId/uploadImage
// Desc     Upload a event image
// Access   Private
Router.put(
    "/:tripId/:eventId/uploadImage",
    authMiddleware,
    tripMiddleware.isAttendee,
    upload.single("image"),
    async(req, res) => {
        // Store request values into callable variables
        const {
            eventId
        } = req.params

        const {
            image
        } = req.body

        try {
            // Retrieve a event by ID
            let event = await Events.findById(eventId);

            // Check if event exist in the database
            if (!event) {
                return res.status(404).send("Events does not exist");
            }

            // Check if a image file exist in the request
            if(!image) {
                return res.status(401).send("Empty image file");
            }

            // Upload image to cloudinary
            let cloudinaryResult = null;
            cloudinaryResult = await cloudinary.uploader.upload(image);

            // Push new image into event's image
            event.image = {
                src: cloudinaryResult.secure_url,
                cloudinaryId: cloudinaryResult.public_id
            }

            // Save the event
            await event.save();

            // Return successful
            return res.status(200).json(event);

        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

// Route    PUT api/event/:tripId/:eventId/removeImage
// Desc     Remove a event image
// Access   Private
Router.put(
    "/:tripId/:eventId/:imageId",
    authMiddleware,
    tripMiddleware.isAttendee,
    upload.single("image"),
    async(req, res) => {
        // Store request values into callable variables
        const {
            eventId,
            imageId
        } = req.params

        try {
            // Retrieve a event by ID
            let event = await Events.findById(eventId);

            // Check if event exist in the database
            if (!event) {
                return res.status(404).send("Events does not exist");
            };

            // Remove event image from cloudinary
            await cloudinary.uploader.destroy(imageId);

            // Remove target image
            // Remove target image
            event.image = {
                src: null,
                title: null, 
                description: null,
                cloudinaryId: null
            }
            
            // Save the event
            await event.save();

            // Return successful
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
    tripMiddleware.isAttendee,
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

            // Remove event from trip's event
            trip.events = trip.events.filter(eventId => eventId.valueOf() !== event._id.valueOf());

            // Update trip's events
            await axios.put(`${baseUrl}/trip/${tripId}`, { events: trip.events }, { headers: { "token": req.header("token") } });
            
            // Update trip's cost
            await axios.put(`${baseUrl}/trip/${tripId}/cost`, {}, { headers: { "token": req.header("token") } });

            // Remove event image from cloudinary
            await cloudinary.uploader.destroy(event.image.cloudinaryId);

            // Remove event from database
            await event.remove();

            // Return successful
            return res.status(200).send("Events has been removed");
        } catch (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }
    }
)

module.exports = Router;