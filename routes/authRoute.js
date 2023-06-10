const express = require('express');

const router = express.Router();

const authController = require('../controller/authController');
const filesMiddleware = require('../middleware/filesMiddleware');

router.post(
    '/signup',
    filesMiddleware.uploadSinglePhoto('photo'),
    filesMiddleware.resizeSmallPhoto('users'),
    authController.signup,
);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refreshToken', authController.refreshToken);

module.exports = router;
