const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String
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
    events: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    restaurants: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    housings: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    attendees: [
        {
            _id: {
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
            personalAddOns: {
                totalCost: {
                    type: Number
                },
                items: [
                    {
                        item: {
                            type: String
                        },
                        cost: {
                            type: Number
                        }
                    }
                ]
            }
        }
    ],
    pendingUsers: [
        {
            _id: {
                type: Schema.Types.ObjectId
            }
        }
    ]
});

const Trip = mongoose.model('trips', TripSchema);

module.exports = Trip;