// Have base url to be production url. Otherwise, have base url to be development url
const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : "";
module.exports = baseUrl;