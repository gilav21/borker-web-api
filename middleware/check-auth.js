const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToekn = jwt.verify(token, 'lalalaisaverylongpasswordtoencryptjwttokens');
        // adding this data to the request will pass it onwards to all middlewears that comes after this one
        req.userData = {email: decodedToekn.email, userId: decodedToekn.userId};
        next();
    } catch (err) {
        res.status(401).json({message: 'bad token'});
    }
};