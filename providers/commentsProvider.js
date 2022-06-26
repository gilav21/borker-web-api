const Comment = require('../models/commentModel');

exports.findByIds = async (ids) => {
    const comments = await Comment.find({
        _id : { $in: ids}
    }).lean().exec();

    return comments;
}