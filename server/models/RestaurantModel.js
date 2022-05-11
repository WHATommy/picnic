const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    tripId: {
        type: Schema.Types.ObjectId,
        ref: 'trips'
    },
    poster: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    cost: {
        type: Number,
        default: 0
    },
    categories: {
        type: Array
    },
    phoneNumber: {
        type: String
    },
    websiteUrl: {
        type: String
    },
    images: {
        type: Array
    },
    attendees: [
        {
            _id: {
                type: Schema.Types.ObjectId
            }
        }
    ]
});

const Restaurant = mongoose.model('restaurant', RestaurantSchema);

module.exports = Restaurant;