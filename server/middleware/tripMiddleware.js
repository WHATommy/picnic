const Trip = require("../models/TripModel");
const Event = require("../models/EventModel");
const Restaurant = require("../models/RestaurantModel");
const Housing = require("../models/HousingModel");
const Attendee = require("../models/AttendeeModel");

const isOwner = async (req, res, next) => {
    const {
        tripId
    } = req.params;
    try {
        // Find the trip in the database by ID
        const trip = await Trip.findById(tripId);
        if(!trip) {
            return res.status(401).json({ error: "Trip does not exist" });
        }
        
        // Check if the user is the owner of the trip
        if(trip.owner.valueOf() !== req.user) {
            return res.status(401).json({ error: "Access denied" });
        } 

        next();
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server error");
    }
}

const isModerator = async (req, res, next) => {
    const {
        tripId,
        userId
    } = req.params;

    try {
        // Find the trip in the database by ID
        const attendee = Attendee.find({tripId: tripId, userId: userId});

        if(!attendee.moderator) {
            isOwner(req, res, next);
            return res.status(401).json({ error: "Access denied" });
        };

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server error");
    }
}

const isPoster = async (req, res, next) => {
    const {
        eventId,
        restaurantId,
        housingId
    } = req.params;
    try {
        // Check if the user is the original poster for the event, restaurant, or housing item
        switch(req.baseUrl) {
            case "/event":
                const event = await Event.findById(eventId);
                if (event.poster == req.user) {
                    return next();
                }
                break;
            case "/restaurant":
                const restaurant = await Restaurant.findById(restaurantId);
                if (restaurant.poster == req.user) {
                    return next();
                }
                break;
            case "/housing":
                const housing = await Housing.findById(housingId);
                if (housing.poster == req.user) {
                    return next();
                }
                break;
            default:
                break;
        }

        isModerator(req, res, next);
        isOwner(req, res, next);

        return res.status(401).json({ error: "Access denied" });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server error");
    }
}

const isAttendee = async (req, res, next) => {
    const {
        tripId
    } = req.params;

    try {
        // Find the trip in the database by ID
        const trip = await Trip.findById(tripId);
        if(!trip) {
            return res.status(401).json({ error: "Trip does not exist" });
        }

        // Check if the user is a attendee and a moderator for the trip
        const isAttending = await Attendee.findOne({ tripId: tripId, userId: req.user});

        if(!isAttending) {
            return res.status(401).json({ error: "Access denied11" });
        };

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server error");
    }
}

const tripMiddleware = { isOwner, isModerator, isPoster, isAttendee };
module.exports = tripMiddleware;