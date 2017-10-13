var mongoose = require("mongoose");

var solutionSchema = mongoose.Schema({
    from: {type: String, default: 'testing@tolete.com'},
    tallerName: {type: String, default: 'Voltus5 Taller Name'},
    subject: {type: mongoose.Schema.Types.ObjectId, default: '59e050feee9596800d015e67'},
    text: {type: String, default: 'Voltus5 Answer'},
    downloadPending: {type: Boolean, default: true},
    createdAt: { type: Date, default: Date.now }
});

var Solution = mongoose.model("Solution", solutionSchema);
module.exports = Solution;