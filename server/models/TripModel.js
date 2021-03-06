const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
    icon: {
        image: {
            type: String,
            default: "https://res.cloudinary.com/dkf1fcytw/image/upload/v1652930330/people_yvvkc0.png"
        },
        cloudinaryId: {
            type: String,
            default: "people_yvvkc0"
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "users"
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