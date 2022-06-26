const Reaction = require('../models/reactionModel');
const Comment = require('../models/commentModel');
const Photo = require('../models/photoModel');
const commentsProvider = require('../providers/commentsProvider');
const reactionsProvider = require('../providers/reactionsProvider');

const ReactionTypes = {
    Smile: 0,
    Laugh: 1,
    Hearts: 2,
    Angry: 3
};

Object.freeze(ReactionTypes);

exports.getReactions = async (req, res, next) => {
    const userId = req.userData.userId;
    const photoId = req.params.photoId;
    const reactions = await Photo.findById(photoId).select('reactions');
    console.log(`The user ${userId} fetched reactions succssfully!`);
    res.status(200).json({ message: 'Reactions Fetched succssfully!', reactions });
}

exports.getPhoto = async (req, res, next) => {
    const userId = req.userData.userId;
    const photoId = req.params.photoId;
    const photo = await Photo.findById(photoId)
        .populate({
            path: 'comments',
            populate: {
                path: 'userId'
            }
        })
        .populate({
            path: 'reactions',
            populate: {
                path: 'userId'
            }
        })
        .lean()
        .exec();

    console.log(`The user ${userId} fetched photo succssfully!`);
    res.status(200).json({ message: 'Photo Fetched succssfully!', photo });
}

exports.addComment = async (req, res, next) => {
    const userId = req.userData.userId;
    const photoId = req.body.photoId;
    const commentString = req.body.comment;
    const photo = await Photo.findById(photoId);
    const commentObj = new Comment();
    commentObj.comment = commentString;
    commentObj.userId = userId;
    commentObj.reactions = [];
    const comment = await commentObj.save();
    if (photo.comments) {
        photo.comments.push(comment._id);
    } else {
        photo.comments = [comment._id];
    }
    const savedPhoto = await photo.save();
    console.log(`The user ${userId} added comment to photo ${photoId} succssfully!`);
    res.status(200).json({ message: 'Comment added succssfully!', comment });
}

exports.addReaction = async (req, res, next) => {
    const userId = req.userData.userId;
    const photoId = req.body.photoId;
    const reactionType = req.body.reaction;
    const photo = await Photo.findById(photoId).populate('reactions');
    
    let reactionIndex;
    let reaction;
    if (photo.reactions && photo.reactions.length > 0) {
        reactionIndex = await photo.reactions.findIndex(reaction => reaction.userId.toString() === userId);
    }
 
    if (reactionIndex == null || reactionIndex === -1) {
        const newReaction = new Reaction();
        newReaction.userId = userId;
        newReaction.type = reactionType;
        reaction = await newReaction.save();
        photo.reactions.push(reaction._id);
    } else {
        const newReaction = await Reaction.findById(photo.reactions[reactionIndex]._id);
        newReaction.type = reactionType;
        reaction = await newReaction.save();
    } 

    const savedPhoto = await photo.save();
    console.log(`The user ${userId} added reaction to photo ${photoId} succssfully!`);
    res.status(200).json({ message: 'Reaction added succssfully!', reaction });
}