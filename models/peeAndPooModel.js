const mongoose = require('mongoose');

const peeAndPooSchema = mongoose.Schema({
    petId: { type: mongoose.Types.ObjectId, required: true, ref: 'Pet' },
    quality: { type: String, required: true },
    type: { type: String, required: true },
    photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}],
    location: { type: String },
    description: { type: String },
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('PeeAndPoo', peeAndPooSchema);