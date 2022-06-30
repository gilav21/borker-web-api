const Reaction = require('../models/reactionModel');
const Comment = require('../models/commentModel');
const Photo = require('../models/photoModel');

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
    if (!photoId) {
        res.status(500).json({message: 'invalid or empty photoId'});
        return;
    }
    const photo = await Photo.findById(photoId)
        // .populate({
        //     path:'comments',
        //     populate: {
        //         path: 'comments'
        //     }
        // })
        .populate('petId')
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
    const photo = await Photo.findById(photoId);

    let reactionIndex;
    let reaction;
    if (photo.reactions && photo.reactions.length > 0) {
        reactionIndex = await photo.reactions.findIndex(reaction => reaction.userId.id.toString() === userId);
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
        newReaction.createdAt = Date.now();
        reaction = await newReaction.save();
    }

    const savedPhoto = await photo.save();
    console.log(`The user ${userId} added reaction to photo ${photoId} succssfully!`);
    res.status(200).json({ message: 'Reaction added succssfully!', reaction });
}

exports.deleteComment = async (req, res, next) => {
    const userId = req.userData.userId;
    const photoId = req.body.photoId;
    const commentId = req.body.commentId;
    const photo = await Photo.findById(photoId);
    const commentIndex = await photo.comments.findIndex(comment => comment.toString() === commentId);
    if (commentIndex !== -1) {
        photo.comments.splice(commentIndex, 1);
        await Comment.deleteOne({ _id: commentId }, (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Error deleting comment!' });
            } else {
                console.log(`The user ${userId} deleted comment ${commentId} succssfully!`);
                res.status(200).json({ message: 'Comment deleted succssfully!' });
            }
        });
    }
    const savedPhoto = await photo.save();
    console.log(`The user ${userId} deleted comment from photo ${photoId} succssfully!`);
    res.status(200).json({ message: 'Comment deleted succssfully!' });
}

exports.deleteReaction = async (req, res, next) => {
    const userId = req.userData.userId;
    const photoId = req.body.photoId;
    const reactionId = req.body.reactionId;
    const photo = await Photo.findById(photoId);
    const reactionIndex = await photo.reactions.findIndex(reaction => reaction.toString() === reactionId);
    if (reactionIndex !== -1) {
        photo.reactions.splice(reactionIndex, 1);
        await Reaction.deleteOne({ _id: reactionId }, (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Error deleting reaction!' });
            } else {
                console.log(`The user ${userId} deleted reaction ${reactionId} succssfully!`);
                res.status(200).json({ message: 'Reaction deleted succssfully!' });
            }
        });
    }
    const savedPhoto = await photo.save();
    console.log(`The user ${userId} deleted reaction from photo ${photoId} succssfully!`);
    res.status(200).json({ message: 'Reaction deleted succssfully!' });
}