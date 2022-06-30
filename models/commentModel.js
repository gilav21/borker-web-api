const mongoose = require('mongoose');
const Reaction = require('./reactionModel');

const commentSchema =  mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User'},
    comment: {type: String},
    reactions: [{type: mongoose.Types.ObjectId, ref: 'Reaction'}],
    comments: [{type: mongoose.Types.ObjectId, ref: 'Comment'}]
});

var autoPopulateChildren = function(next) {
    console.log('populate comment');
    this.populate('userId');
    // this.populate('reactions');
    next();
};

commentSchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren)

 const schema= mongoose.model('Comment', commentSchema);
 
 module.exports = schema;