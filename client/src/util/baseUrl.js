const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : "";
module.exports = baseUrl;