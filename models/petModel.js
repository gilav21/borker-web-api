const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    name: {type: String, required: true},
    owners: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    photos: [{type: mongoose.Types.ObjectId, ref: 'Photo'}],
    profilePhoto: {type: mongoose.Types.ObjectId, ref: 'Photo'},
    description: {type: String},
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User'}
});


var autoPopulateChildren = function(next) {
    console.log('populate pet');
    this.populate('owners');
    this.populate('photos');
    this.populate('profilePhoto');
    next();
};

petSchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren)

module.exports = mongoose.model('Pet', petSchema);