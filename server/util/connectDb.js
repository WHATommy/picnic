const mongoose = require("mongoose");

async function connectDb() {
    try {
        const db = require("../config/keys").mongoURI;
        await mongoose.connect(db);
        console.log("MongoDB connected...");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDb;