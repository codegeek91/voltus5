var mongoose = require("mongoose");

var solutionSchema = mongoose.Schema({
    from: {type: String, default: 'testing@tolete.com'},
    tallerName: {type: String, default: 'Voltus5 Taller Name'},
    subject: {type: String, default: 'Problem ID Here'},
    text: {type: String, default: 'Voltus5 Answer'},
    downloadPending: {type: Boolean, default: true},
    createdAt: { type: Date, default: Date.now }
});

var Solution = mongoose.model("Solution", solutionSchema);
module.exports = Solution;