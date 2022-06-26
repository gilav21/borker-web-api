const Reaction = require('../models/reactionModel');

exports.findByIds = async (ids) => {
    const reactions = await Reaction.find({
        _id : { $in: ids}
    }).lean().exec();

    return reactions;
}

exports.getMyReaction = async (photoId, userId) => {
    const reaction = await Reaction.findOne({
        userId
    });
    return reaction;
}

exports.updateMyReaction = async (photoId, userId, reaction) => {
    const updatedReaction = await Reaction.findOneAndUpdate({userId}, {type: reaction});
    return updatedReaction;
}