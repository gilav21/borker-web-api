const mongoose = require('mongoose');
const Comment = require('./commentModel');
const Reaction = require('./reactionModel');


const photoSchema = mongoose.Schema({
    title: { type: String, required: true },
    petId: { type: mongoose.Types.ObjectId, required: true },
    url: { type: String, required: true },
    description: { type: String },
    comments: [{type: mongoose.Types.ObjectId, ref: 'Comment'}],
    reactions: [{type: mongoose.Types.ObjectId, ref: 'Reaction'}],
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Photo', photoSchema);
