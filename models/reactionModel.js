const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    type: {type: String},
    userId: {type: mongoose.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User'}
}); 

var autoPopulateChildren = function(next) {
    console.log('populate reaction');
    this.populate('userId');
    next();
};

reactionSchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren)

module.exports = mongoose.model('Reaction', reactionSchema);
