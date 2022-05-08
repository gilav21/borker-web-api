const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pet = require('../models/pet');
const User = require('../models/user');
const path = require('path');


exports.getPetsByUserId = async (req, res, next) => {
    const userId = req.query.userId;
    const pets = await Pet.find({
        owners: {$in: userId}
    });

    res.status(200).json({message: 'retreived pets successfully', pets});
}

exports.petImages = async (req, res, next) => {
    const files = req.files;
    const petId = req.body.id;
    const pet = await Pet.findById(petId);
    if (pet) {
        const photos = pet.photos ? pet.photos : [];
        if (files && files.length > 0) {
            files.forEach(file => {
                photos.push(file.filename);
            });
            pet.photos = photos;
            const savedPet = await pet.save();
            res.status(200).json({message: 'images saved successfully', photos: pet.photos});
        }
    } else {
        res.status(500).json({message: 'pet could not be found, please check that the id is correct'});
    }

    res.status(200);
}

exports.petImage = async (req,res,next) => {
    const fileName = req.params.fileName;
    const options = {
        root: path.join('backend/images/')
    };
    res.status(200).sendFile(fileName, options);
}

exports.createPet = (req, res, next) => {
    const pet = req.body;
    const newPet = new Pet();
    newPet.name = pet.name;
    newPet.owners = pet.owners;
    newPet.photos = pet.photos;
    newPet.save().then(results => {
        res.status(200).json({message: 'Pet added successfully', petId: results._id});
    }, error => {
        res.status(500).json({message: error});
    });
}