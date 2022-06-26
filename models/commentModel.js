const mongoose = require('mongoose');
const Reaction = require('./reactionModel');

const commentSchema =  mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User'},
    comment: {type: String},
    reactions: [{type: mongoose.Types.ObjectId, ref: 'Reaction'}],
    comments: [{type: mongoose.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Comment', commentSchema);