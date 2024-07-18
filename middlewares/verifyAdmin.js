require('dotenv').config('../config/.env');
const jwt = require('jsonwebtoken');

module.exports.isAdmin = (req, res, next) => {
    var token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Aucun jeton' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.substring(7);
    }

    jwt.verify(token, 'xwhjd75HUhiK', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Jwt invalide' });
        }

        if (!decoded || !decoded.role) {
            return res.status(401).json({ message: 'Jetons JWT invalide ou manquant de données utilisateur.' });
        }

        req.user = decoded;
        next();
    });
};