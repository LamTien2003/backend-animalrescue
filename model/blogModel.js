const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Blog must have a title'],
            minlength: [5, 'Title must have more than 5 character'],
            maxlength: [50, 'Title must have less than 50 character'],
        },
        content: {
            type: String,
            required: [true, 'Blog must have a content'],
            minlength: [10, 'Title must have more than 10 character'],
            maxlength: [30000, 'Title must have less than 30000 character'],
        },
        coverImage: {
            type: String,
            required: [true, 'Blog must have a cover image'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Blog have to create by someone'],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

blogSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName photo',
    });
    next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
