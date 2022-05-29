const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header("token");

    // Check if token exist
    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }

    // Verify the token
    try {
        const jwtSecret = require("../config/keys").secretOrKey;
        jwt.verify(token, jwtSecret, (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: "Invalid token" });
        } else {
            req.user = decoded.userId;
            next();
        }
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};