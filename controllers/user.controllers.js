require('dotenv').config({ path: '../config' })
const logger = require('../logger')

const Allergene = require('../models/allergene.model')
const User = require('../models/user.model')

module.exports.addAllergene = async (req, res) => {
    const { userId, allergene } = req.body;

    try {
        const userExists = await User.exists({ _id: userId });

        if (!userExists) {
            return res.status(404).json({ error: 'Cet ID n\'est pas dans la table' });
        }

        const existingAllergene = await Allergene.findOne({ user: userId, allergene });

        if (existingAllergene) {
            return res.status(400).json({ message: 'Cet allergène existe déjà pour cet utilisateur.' });
        }

        const newAllergene = new Allergene({ user: userId, allergene });
        await newAllergene.save();

        return res.status(200).json({ message: 'Allergène ajouté avec succès.' });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'allergène.' });
    }
};


module.exports.deleteAllergene = async (req, res) => {
    const { userId, allergene } = req.body;

    try {
        const userExists = await User.exists({ _id: userId });

        if (!userExists) {
            return res.status(404).json({ error: 'Cet ID n\'est pas dans la table' });
        }

        const deletedAllergene = await Allergene.findOneAndDelete({ user: userId, allergene });

        if (!deletedAllergene) {
            return res.status(404).json({ message: `L'allergène ${allergene} n'a pas été trouvé` });
        }

        return res.status(200).json({ message: `L'allergène ${allergene} a été supprimé avec succès` });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: 'Erreur lors de la suppression de l\'allergène' });
    }
};

module.exports.getAllergene = async (req, res) => {
    const { userId } = req.body;

    try {
        const userExists = await User.exists({ _id: userId });

        if (!userExists) {
            return res.status(404).json({ error: 'Cet ID n\'est pas dans la table' });
        }

        const allergenes = await Allergene.find({ user: userId });

        const uniqueAllergenes = [...new Set(allergenes.map(item => item.allergene))];

        return res.status(200).json({ allergenes: uniqueAllergenes });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: 'Erreur lors de la récupération des allergènes' });
    }
};