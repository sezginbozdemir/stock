const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userData = require("./userModel.js");

mongoose
  .connect("mongodb+srv://bozdemirsezgin1:polyxena@cluster0.bgthz8p.mongodb.net/stock_app_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

module.exports = mongoose.connection;
