// Libraries
const express = require("express");
const app = express();

// Body parser 
app.use(express.json());

// Import API into Server
const signup = require("./api/signup");
const auth = require("./api/auth");
const users = require("./api/user");

// Routes
app.use("/signup", signup);
app.use("/auth", auth);
app.use("/user", users);

// Connect to mongo database
const connectDb = require("./util/connectDb");
connectDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on server ${PORT}`))