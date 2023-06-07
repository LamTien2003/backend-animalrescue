const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Blog = require('../model/blogModel');

exports.createBlog = catchAsync(async (req, res, next) => {
    const payload = { ...req.body, user: req.user.id };

    if (req?.file?.filename) {
        payload.coverImage = req.file.filename;
    }

    const blog = await Blog.create(payload);

    return res.status(200).json({
        status: 'success',
        message: 'Create a new blog successfully',
        data: blog,
    });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
        return next(new AppError('Blog is not exist to delete', 400));
    }

    return res.status(204).json({
        status: 'success',
        message: 'Delete a blog successfully',
    });
});

exports.changeBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('Blog is nolonger exist to change a content', 400));
    }

    if (req.body.title) blog.title = req.body.title;
    if (req.body.content) blog.content = req.body.content;
    if (req.body?.file?.filename) blog.coverImage = req.body.file.filename;

    await blog.save();
    return res.status(200).json({
        status: 'success',
        message: 'Change blog successfully',
        data: blog,
    });
});

exports.getAllBlog = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 4 } = req.query;
    const skip = (page - 1) * limit;

    const countBlogs = await Blog.find({}).estimatedDocumentCount();

    const blogs = await Blog.find({}).skip(skip).limit(limit);

    if (!blogs) {
        return next(new AppError('Have some error when try to get all Blog', 400));
    }
    return res.status(200).json({
        status: 'success',
        data: blogs,
        countBlogs: countBlogs,
    });
});

exports.getBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('Blog is not exist', 400));
    }

    return res.status(200).json({
        status: 'success',
        data: blog,
    });
});
