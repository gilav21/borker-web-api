const mongoose = require('mongoose');

const reaction = new mongoose.Schema({
    type: {type: String},
    userId: {type: mongoose.Types.ObjectId}
});

const comment = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId},
    comment: {type: String},
    reactions: [reaction],
});
comment.add({
    comments: [comment]
});

const photoSchema = mongoose.Schema({
    title: { type: String, required: true },
    petId: { type: mongoose.Types.ObjectId, required: true },
    url: { type: String, required: true },
    description: { type: String },
    comments: [comment],
    reactions: [reaction],
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {type: mongoose.Types.ObjectId}
});

module.exports = mongoose.model('Photo', photoSchema);