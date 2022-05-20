const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
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
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    cost: {
        type: Number
    },
    description: {
        type: String
    },
    phoneNumber: {
        type: String
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

const Event = mongoose.model('events', EventSchema);

module.exports = Event;