const mongoose = require('mongoose');
const Comment = require('./commentModel');
const Reaction = require('./reactionModel');


const photoSchema = mongoose.Schema({
    title: { type: String, required: true },
    petId: { type: mongoose.Types.ObjectId, required: true , ref: 'Pet'},
    url: { type: String, required: true },
    description: { type: String },
    comments: [{type: mongoose.Types.ObjectId, ref: 'Comment'}],
    reactions: [{type: mongoose.Types.ObjectId, ref: 'Reaction'}],
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User'}
});

var autoPopulateChildren = function(next) {
    console.log('populate photo');
    // this.populate('petId');
    this.populate('comments');
    this.populate('reactions');
    next();
};

photoSchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren)

module.exports = mongoose.model('Photo', photoSchema);
