const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    type: {type: String},
    userId: {type: mongoose.Types.ObjectId, ref: 'User'}
}); 

module.exports = mongoose.model('Reaction', reactionSchema);
