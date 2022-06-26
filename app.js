const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes
const usersRoutes = require('./routes/usersRoute');
const petsRoutes = require('./routes/petsRoute');
const peeAndPooRoutes = require('./routes/peeAndPooRoute');
const photosRoutes = require('./routes/photoRoute');

const app = express();

mongoose.set('useCreateIndex', true);
// mongoose.connect('mongodb+srv://gilav21:ZVcCuLov6Jze5ib1@borker.cvexh.mongodb.net/borker?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
mongoose.connect('mongodb://localhost:27017/borker', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Conneted to DB');
}).catch(() => {
    console.log('Failed conneting to DB!');
});

app.use(bodyParser.json());
// will allow access to the images folder
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
});

app.use('/api/users', usersRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/peeAndPoo', peeAndPooRoutes);
app.use('/api/photos', photosRoutes);

module.exports = app;

