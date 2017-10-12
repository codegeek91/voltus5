var mongoose = require("mongoose");

var tallerSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    address: {type: String},
    responses: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },
});

var Taller = mongoose.model("Taller", tallerSchema);
module.exports = Taller;