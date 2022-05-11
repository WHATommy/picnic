const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // TODO: add default pointing to a default image
    image: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    trips: [
        {
            _id: {
                type: Schema.Types.ObjectId
            }
        }
    ],
    invitations: [
        {
            _id: {
                type: Schema.Types.ObjectId
            }
        }
    ]
})

const User = mongoose.model("users", UserSchema);
module.exports = User;