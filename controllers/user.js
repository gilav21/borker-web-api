const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const usersProvider = require('../providers/usersProvider');
const SECRET = 'lalalaisaverylongpasswordtoencryptjwttokens';
const USER_SELECT_FIELDS = '_id email userName firstName lastName';

exports.getUsers = async (req, res, next) => {
    const userQuery = req.query.user;
    const users = await usersProvider.getUsersLike(userQuery);
    res.status(200).json({ message: 'Users Fetches succssfully!', users });
};

exports.deleteUser = (req, res, next) => {
    console.log('Deleting id :', req.params.id);
    User.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: `Removed id ${req.params.id} successfully` });
    })
};

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        const password = user.password;
        delete user.password;
        fetchedUser = user;
        return bcrypt.compare(req.body.password, password)
    }).then(result => {
        if (!result) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        // create JWT and send back
        const token = signJwt({ email: fetchedUser.email, userId: fetchedUser._id });
        res.status(200).json({
            token: token,
            expiresIn: (1000 * 60 * 60),
            user: fetchedUser
        })
    }).catch(err => {
        console.log(err);
        return res.status(401).json({ message: 'Auth failed' });
    });
};

exports.renewToken = async (req, res, next) => {
    const token = req.body.token;
    if (token) {
        try {
            const content = jwt.verify(token, SECRET);
            const user = await User.findOne({ email: content.email });
            if (user) {
                const token = signJwt({ email: user.email, userId: user._id });
                res.status(200).json({ token });
            } else {
                res.status(500).json({
                    error: `couldn't find token's user`
                });
            }

        } catch (err) {
            res.status(500).json({
                error: `couldn't find token's user:` + err.message
            });
        }
        const user = await User.findOne({ email: content.email });
        if (user) {
            const token = signJwt({ email: user.email, userId: user._id });
            res.status(200).json({ token });
        } else {
            res.status(500).json({
                error: `couldn't find token's user`
            });
        }
    } else {
        res.status(500).json({
            error: 'token not sent'
        });
    }
};

const signJwt = (content) => {
    return jwt.sign(content,
        'lalalaisaverylongpasswordtoencryptjwttokens', { expiresIn: '1h' });
}

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 15).then(hash => {
        const user = new User({
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
        });
        user.save().then(result => {
            res.status(200).json({
                message: 'User added successfully!',
                id: result._id
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
}

exports.checkUserName = async (req, res, next) => {
    const userName = req.query.userName;
    if (userName && userName.length > 0) {
        const user = await User.findOne({ username: userName });
        if (user) {
            res.status(500).json({
                error: `Username already exist`
            });
        } else {
            res.status(200).json({
                message: 'Username available'
            })
        }
    } else {
        res.status(500).json({
            error: `User name can't be empty`
        });
    }
}

exports.checkEmail = async (req, res, next) => {
    const email = req.query.email;
    if (email && email.length > 0) {
        const user = await User.findOne({ email: email });
        if (user) {
            res.status(500).json({
                error: `Email already exist`
            });
        } else {
            res.status(200).json({
                message: 'Email available'
            })
        }
    } else {
        res.status(500).json({
            error: `Email can't be empty`
        });
    }
}