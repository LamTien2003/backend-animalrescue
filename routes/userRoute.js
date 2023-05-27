const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/getme', authMiddleware.protectLogin, userController.getMe);
router.get('/:id', userController.getUser);
router.get('/', userController.getAllUser);

module.exports = router;
