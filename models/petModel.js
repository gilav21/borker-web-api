const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    name: {type: String, required: true},
    owners: { type: Array, required: true},
    photos: [mongoose.Schema.Types.ObjectId],
    profilePhoto: {type: String},
    description: {type: String},
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {type: mongoose.Types.ObjectId}
});

module.exports = mongoose.model('Pet', petSchema);