const mongoose = require("mongoose");

const dataSchema2 = new mongoose.Schema({
    client_name: String,
    sale_price: Number,
    sale_product_name: String,
    sale_date: Date,
    sale_quantity: Number,
});

module.exports = mongoose.model("Sales", dataSchema2);