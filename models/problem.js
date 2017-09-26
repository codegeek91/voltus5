var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var problemSchema = mongoose.Schema({
    category: { type: String},
    title: {type: String},
    content: {type: String, required: true},
    brand: {type: String},
    model: {type: String},
    source: {type: String, required: true},
    personName: { type: String},
    personEmail: { type: String},
    personPhone: { type: String},
    personLocation: { type: String},
    createdAt: { type: Date, default: Date.now },
    pending: { type: Boolean, default: true },
    moderatorPending: {type: Boolean, default: true},
    downloadPending: {type: Boolean}
});

problemSchema.plugin(mongoosePaginate);

var Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;