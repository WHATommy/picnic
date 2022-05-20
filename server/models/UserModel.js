const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    profilePic: {
        image: {
            type: String,
            default: "https://res.cloudinary.com/dkf1fcytw/image/upload/v1652972711/user_tdosel.png"
        },
        cloudinaryId: {
            type: String,
            default: "user_tdosel"
        }
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