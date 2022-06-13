const mongoose = require('mongoose');

const peeAndPooSchema = mongoose.Schema({
    petId: { type: mongoose.Types.ObjectId, required: true },
    quality: { type: String, required: true },
    type: { type: String, required: true },
    photos: [mongoose.Schema.Types.ObjectId],
    location: { type: String },
    description: { type: String },
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {type: mongoose.Types.ObjectId}
});

module.exports = mongoose.model('PeeAndPoo', peeAndPooSchema);