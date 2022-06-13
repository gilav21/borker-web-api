const PeeAndPoo = require('../models/peeAndPooModel');

exports.createPeeAndPoo = async (req, res, next) => {
    const userId = req.userData.userId;
    const peeAndPoo = req.body;
    const peeAndPooObject = new PeeAndPoo(peeAndPoo);
    peeAndPooObject['createdBy'] = userId;
    peeAndPooObject.save().then(result => {
        res.status(200).json({
            message: 'PeeAndPoo added successfully!',
            id: result._id
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.getPeeAndPooByPetId = async (req, res, next) => {
    try {
        const userId = req.userData.userId;
        const petId = req.params.petId;
        let sort = { createdAt: -1 };
        if (req.query.sortBy && req.query.direction) {
            sort = {};
            sort[req.query.sortBy] = +req.query.direction;
        }
        console.log('sorting:', sort)
        const peeAndPoops = await PeeAndPoo.find({ petId }).sort(sort);
        res.status(200).json({ message: 'Retreived pee and poos successfully', peeAndPoops });
    } catch (err) {
        res.status(500).json({error: err});
    }

}