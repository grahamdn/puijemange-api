require('dotenv').config({ path: '../config' });
const logger = require('../logger');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const { isAdmin } = require('../middlewares/verifyAdmin');

module.exports.getAllUsers = (req, res) => {
    isAdmin(req, res, async () => {
        try {
            const users = await User.find({}, { password: 0 });
            res.json(users);
        } catch (err) {
            logger.error('Une erreur est survenue', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
        }
    });
};

module.exports.deleteUser = async (req, res) => {
    isAdmin(req, res, async () => {
        const { userId } = req.params; // Utilise req.params pour récupérer l'ID de l'utilisateur à supprimer

        try {
            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                return res.status(404).json({ message: `L'utilisateur avec l'ID ${userId} n'a pas été trouvé` });
            }

            return res.status(200).json({ message: `L'utilisateur avec l'ID ${userId} a été supprimé avec succès` });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
        }
    });
};
