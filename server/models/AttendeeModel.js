const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendeeSchema = new Schema({
    tripId: {
        type: Schema.Types.ObjectId
    },
    userId: {
        type: Schema.Types.ObjectId
    },
    moderator: {
        type: Boolean,
        default: false
    },
    personalCost: {
        type: Number,
        default: 0
    },
    attending: {
        events: [
            {
                _id: Schema.Types.ObjectId,
            }
        ],
        housings: [
            {
                _id: Schema.Types.ObjectId
            }
        ],
        restaurants: [
            {
                _id: Schema.Types.ObjectId
            }
        ]
    }
});

const Attendee = mongoose.model('attendees', AttendeeSchema);
module.exports = Attendee;