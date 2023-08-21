const mongoose = require("mongoose");
const shortid = require("shortid");

const dataSchema = new mongoose.Schema({
        customId: {
        type: String,
        default: shortid.generate,
        required: true,
        unique: true
    },
    product_name: String,
    base_price: Number,
    quantity: Number,
});


module.exports = mongoose.model("Products", dataSchema);
