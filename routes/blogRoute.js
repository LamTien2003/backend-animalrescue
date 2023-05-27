const express = require('express');
const router = express.Router();

const blogController = require('../controller/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const filesMiddleware = require('../middleware/filesMiddleware');

const Blog = require('../model/blogModel');

router.get('/:id', blogController.getBlog);
router.get('/', blogController.getAllBlog);

// Auth
router.use(authMiddleware.protectLogin);

router.delete('/:id', authMiddleware.checkOwner(Blog, 'admin', 'manage'), blogController.deleteBlog);
router.patch(
    '/:id',
    authMiddleware.checkOwner(Blog, 'admin', 'manage'),
    filesMiddleware.uploadSinglePhoto('coverImage'),
    filesMiddleware.resizePhoto('blogs'),
    blogController.changeBlog,
);
router.post(
    '/',
    authMiddleware.restrictTo('admin'),
    filesMiddleware.uploadSinglePhoto('coverImage'),
    filesMiddleware.resizePhoto('blogs'),
    blogController.createBlog,
);

module.exports = router;
