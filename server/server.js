// Express
const express = require("express");
const app = express();

// Body parser 
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));

// Cors
const cors = require("cors");
app.use(cors());

// Import API into Server
const signup = require("./api/signup");
const auth = require("./api/auth");
const user = require("./api/user");
const trip = require("./api/trip");
const event = require("./api/event");
const housing = require("./api/housing");
const restaurant = require("./api/restaurant");
const invite = require("./api/invite");
const attendee = require("./api/attendee");

// Route requests to respective APIs
app.use("/signup", signup);
app.use("/auth", auth);
app.use("/user", user);
app.use("/trip", trip);
app.use("/event", event);
app.use("/housing", housing);
app.use("/restaurant", restaurant);
app.use("/invite", invite);
app.use("/attendee", attendee);

// Connect to mongoDB
const connectDb = require("./util/connectDb");
connectDb();

// Web socket
const server = require("http").createServer(app);   // Conjunction with express.js for websocket

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(__dirname, "../client/build"));

  app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "../client", 'index.html'));
  })
}

// Server listening on PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on server ${PORT}`))

