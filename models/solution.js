var mongoose = require("mongoose");

var solutionSchema = mongoose.Schema({
    from: {type: String, required: true},
    subject: {type: String, required: true},
    text: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    downloadPending: {type: Boolean}
});

var Solution = mongoose.model("Solution", solutionSchema);
module.exports = Solution;