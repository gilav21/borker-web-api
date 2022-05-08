const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    name: {type: String, required: true},
    owners: { type: Array, required: true},
    photos: {type: Array}
});

// petSchema.index('email');
// petSchema.index('username');
module.exports = mongoose.model('Pet', petSchema);