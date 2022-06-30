const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    profilePhoto: {type: mongoose.Types.ObjectId, ref: 'Photo'},
    createdAt: {type: Date, required: true, default: Date.now},
});

var autoPopulateChildren = function(next) {
    console.log('populate user');
    next();
};

userSchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren)

userSchema.index('email');
userSchema.index('userName');
module.exports = mongoose.model('User', userSchema);