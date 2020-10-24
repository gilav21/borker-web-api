const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//
const usersRoutes = require('./routes/users');
const { static } = require('express');
//
const app = express();

mongoose.connect('').then(() => {
    console.log('Conneted to DB');
}).catch(() => {
    console.log('Failed conneting to DB!');
});

app.use(bodyParser.json());
// will allow access to the images folder
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    console.log('Adding CORS header');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
});

app.use('/api/users', usersRoutes);

module.exports = app;

