// Libraries
const express = require("express");
const app = express();

// Body parser 
app.use(express.json());

// Import API into Server
const signup = require("./api/signup");
const auth = require("./api/auth");
const user = require("./api/user");
const trip = require("./api/trip");
const event = require("./api/event");
const housing = require("./api/housing");
const restaurant = require("./api/restaurant");
const invite = require("./api/invite");

// Routes
app.use("/signup", signup);
app.use("/auth", auth);
app.use("/user", user);
app.use("/trip", trip);
app.use("/event", event);
app.use("/housing", housing);
app.use("/restaurant", restaurant);
app.use("/invite", invite);

// Connect to mongo database
const connectDb = require("./util/connectDb");
connectDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on server ${PORT}`))