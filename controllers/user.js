const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.getUsers = (req, res, next) => {
    console.log(req.query);
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = User.find();

    // get pagination posts
    if (pageSize && currentPage) {
        postQuery
        // set the offset to skip the first pages
        .skip(pageSize * (currentPage - 1))
        // get only 'pageSize' items
        .limit(pageSize);
        
    }   
    // get all posts
    postQuery.find().then(results => {
        res.status(200).json({ message: 'Names Fetches succssfully!', users: results });
    }).catch((err) => {
        console.log(err);
    });
};

exports.deleteUser = (req, res, next) => {
    console.log('Deleting id :', req.params.id);
    User.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: `Removed id ${req.params.id} successfully`});
    })
};

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email}).then(user => {
        if (!user) {
            return res.status(401).json({message: 'Auth failed'});
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
    }).then(result => {
        if (!result) {
            return res.status(401).json({message: 'Auth failed'});
        }
        // create JWT and send back
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 'lalalaisaverylongpasswordtoencryptjwttokens', {expiresIn: '1h'});
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    }).catch(err => {
        console.log(err);
        return res.status(401).json({message: 'Auth failed'});
    });
};

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 15).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        user.save().then(result => {
            res.status(200).json({
                 message: 'User added successfully!',
                 id:  result._id
                });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
}