const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const usersProvider = require('../providers/usersProvider');

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

exports.loginUser = async (req, res, next) => {
    let fetchedUser;
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        console.error('Auth failed at login');
        return res.status(401).json({ message: 'Auth failed' });
    }
    const password = user.password;
    delete user.password;
    fetchedUser = user;
    const result = await bcrypt.compare(req.body.password, password);
    if (!result) {
        console.error('Auth failed at password compare');
        res.status(401).json({ message: 'Auth failed' });
    }
    // create JWT and send back
    const token = signJwt({ email: fetchedUser.email, userId: fetchedUser._id });
    console.log('logged in: ', fetchedUser._id);
    res.status(200).json({
        token: token,
        expiresIn: (1000 * 60 * 60),
        user: fetchedUser
    })
};

exports.renewToken = async (req, res, next) => {
    const token = req.body.token;
    if (token) {
        try {
            const content = jwt.decode(token);
            const user = await User.findOne({ email: content.email });
            if (user) {
                const token = signJwt({ email: user.email, userId: user._id });
                console.log('renewed token');
                res.status(200).json({ token });
            } else {
                console.error(`couldn't find token's user`);
                res.status(500).json({
                    error: `couldn't find token's user`
                });
            }

        } catch (err) {
            res.status(500).json({
                error: `couldn't find token's user:` + err.message
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
        'lalalaisaverylongpasswordtoencryptjwttokens', { expiresIn: '30m' });
}

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 13).then(hash => {
        const user = new User({
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
        });
        user.save().then(result => {
            console.log('signed up: ', result._id);
            res.status(200).json({
                message: 'User added successfully!',
                id: result._id
            });
        }).catch(err => {
            console.error('failed signing the user: ', err);
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