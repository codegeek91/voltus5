var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var problemSchema = mongoose.Schema({
    category: { type: String, required: true },
    title: {type: String, required: true},
    content: {type: String, required: true},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    personName: { type: String, required: true},
    personEmail: { type: String},
    personPhone: { type: String, required: true},
    personLocation: { type: String},
    createdAt: { type: Date, default: Date.now },
    pending: { type: Boolean, default: true },
    moderatorPending: {type: Boolean, default: true}
});

problemSchema.plugin(mongoosePaginate);

var Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;