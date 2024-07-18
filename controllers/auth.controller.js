require("dotenv").config();
const logger = require("../logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

const saltRounds = 9;

module.exports.register = async (req, res) => {
  const { email, username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    return res.status(201).json({ message: "Inscription réussie" });
  } catch (err) {
    logger.error(err);
    return res
      .status(500)
      .json({ message: "Une erreur est survenue lors de l'enregistrement" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Cet utilisateur n'existe pas" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Mot de passe invalide" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    return res.status(200).json({ token, id: user.id });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

module.exports.user = (req, res) => {
  const userEmail = req.user.email;

  User.findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const userData = {
        id: user._id,
        username: user.username,
        role: user.role,
      };
      return res.json({
        message: "Infos récupérées avec succès",
        user: userData,
      });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération de l'utilisateur" });
    });
};
