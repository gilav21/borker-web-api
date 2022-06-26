const User = require('../models/userModel');


const USER_SELECT_FIELDS = '_id email userName firstName lastName';

exports.getUsersLike = async (user, fields) => {
    const userRegexp = new RegExp("^" + user, 'i');
    const users = await User.find({
        $or: [
            { userName: userRegexp },
            { firstName: userRegexp },
            { lastName: userRegexp },
            { email: userRegexp },
            { _id: userRegexp}
        ]
    }).select(fields ? fields : USER_SELECT_FIELDS);
    return users;
};