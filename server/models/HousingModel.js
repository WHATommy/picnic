const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HousingSchema = new Schema({
    tripId: {
        type: Schema.Types.ObjectId,
        ref: 'trips'
    },
    images: [
        {
            image: {
                type: String
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            cloudinaryId: {
                type: String
            }
        }
    ],
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
    description: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    cost: {
        type: Number
    },
    websiteUrl: {
        type: String
    },
    attendees: [
        {
            _id: {
                type: Schema.Types.ObjectId
            }
        }
    ]
});

const Housing = mongoose.model('housing', HousingSchema);

module.exports = Housing;