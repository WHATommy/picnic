// Libraries
const express = require("express");
const app = express();

// Body parser 
app.use(express.json());

// Connect to mongo database
const connectDb = require("./util/connectDb");
connectDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on server ${PORT}`))