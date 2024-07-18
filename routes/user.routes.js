const router = require('express').Router();
const userController = require('../controllers/user.controllers');

router.post('/addAllergene', userController.addAllergene);
router.post('/deleteAllergene', userController.deleteAllergene);
router.post('/getAllergenes', userController.getAllergene)

module.exports = router;