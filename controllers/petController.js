const Pet = require('../models/petModel');
const Photo = require('../models/photoModel');
const path = require('path');
const ObjectId = require('mongoose').Types.ObjectId;


exports.getPetById = async (req, res, next) => {
    const petId = req.params.petId;
    const userId = req.userData.userId;
    const pet = await Pet.findById(petId);
    if (pet) {
        if (isOwner(pet, userId)) {
            res.status(200).json({ message: 'Retreived pet successfully', pet });
        } else {
            res.status(500).json({ message: 'The user is not an owner of the pet' });
        }
    } else {
        res.status(500).json({ message: `Pet wans't found` });
    }
}

exports.getPetsByUserId = async (req, res, next) => {
    const userId = req.query.userId;
    const pets = await Pet.find({
        owners: { $in: userId }
    });

    res.status(200).json({ message: 'Retreived pets successfully', pets });
}

exports.petImages = async (req, res, next) => {
    const files = req.files;
    const petId = req.body.id;
    const userId = req.userData.userId;
    const pet = await Pet.findById(petId);
    if (pet) {
        if (isOwner(pet, userId)) {
            const photos = pet.photos ? pet.photos : []; 
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const currPhoto = new Photo();
                    currPhoto.createdBy = userId;
                    currPhoto.url = files[i].filename;
                    currPhoto.title = files[i].originalname;
                    currPhoto.petId = petId;
                    const savedPhoto = await currPhoto.save();
                    photos.push(savedPhoto._id);
                }
                pet.photos = photos;
                const savedPet = await pet.save();
                res.status(200).json({ message: 'Images saved successfully', photos: pet.photos });
            }
        } else {
            res.status(401).json({ message: 'The user is not an owner of the pet' });
        }
    } else {
        res.status(500).json({ message: 'Pet could not be found, please check that the id is correct' });
    }

    res.status(200);
}

exports.getPetImages = async (req, res, next) => {
    const petId = req.params.petId;
    const userId = req.userData.userId;
    const pet = await Pet.findById(petId);
    if (pet) {
        if (isOwner(pet, userId)) {
            const photoIds = pet.photos;
            if (photoIds && photoIds.length > 0) {
                const photos = await Photo.find({
                    _id : { $in: photoIds}
                });

                if (photos && photos.length > 0) {
                    res.status(200).json({message: 'Photos Retrieved successfully', photos});
                }
            }
        } else {
            res.status(500).json({ message: 'The user is not an owner of the pet' });
        }
    }
}

exports.petImage = async (req, res, next) => {
    const photoId = req.params.photoId; 
    if (photoId && ObjectId.isValid(photoId)) {
        const photo = await Photo.findById(photoId);
        if (photo) {
            const fileName = photo.url;
            const petId = photo.petId;
            const userId = req.userData.userId;
            const pet = await Pet.findById(petId);
            if (isOwner(pet, userId)) {
                const options = {
                    root: path.join('backend/images/')
                };
                res.status(200).sendFile(fileName, options);
            }  else {
                res.status(401).json({ message: 'The user is not an owner of the pet' });    
            }
        } else {
            res.status(500).json({ message: 'Photo id missing or invalid' });    
        }
    }
}

exports.createPet = (req, res, next) => {
    const pet = req.body;
    const userId = req.userData.userId;
    const newPet = new Pet();
    newPet.name = pet.name;
    newPet.owners = pet.owners;
    newPet.photos = pet.photos;
    newPet.description = pet.description;
    newPet.createdBy = userId;
    newPet.save().then(results => {
        res.status(200).json({ message: 'Pet added successfully', petId: results._id });
    }, error => {
        res.status(500).json({ message: error });
    });
}

exports.changeProfileImage = async (req, res, next) => {
    const petId = req.body.petId;
    const imageimageId = req.body.imageId;
    const pet = await Pet.findById(petId);
    const userId = req.userData.userId;
    if (isOwner(pet, userId)) {
        pet.profilePhoto = imageimageId;
        pet.save().then(results => {
            res.status(200).json({ message: 'Photo changed successfully' });
        }, error => {
            res.status(500).json({ message: error });
        });
    } else {
        res.status(401).json({ message: 'The user is not an owner of the pet' });
    }
}

const isOwner = (pet, userId) => {
    return pet.owners.findIndex(owner => owner === userId) !== -1;
}