const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register)
router.post('/login', authController.login)
//router.post('/sendPasswordResetEmail', authController.sendPasswordResetEmail)

router.get('/user', authController.user)

module.exports = router;