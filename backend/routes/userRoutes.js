var express = require('express');
var router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const userController = require('../controllers/userController');

router.get('/getProfile', auth, userController.getProfile);
router.put('/updateProfile',auth,upload.single('profilePicture'), userController.updateProfile);

module.exports = router;
