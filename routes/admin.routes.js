const router = require('express').Router();
const adminController = require('../controllers/admin.controllers');

router.get('/getAllUsers', adminController.getAllUsers);
router.delete('/deleteUser/:userId', adminController.deleteUser);

module.exports = router;
