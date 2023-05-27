const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../model/userModel');

exports.protectLogin = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logging right now. Please Login again !!'));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_ACCESS_KEY);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
        return next(new AppError('The user belong to this token nolonger exist', 401));
    }
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    req.user = user;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

exports.checkOwner = (Model, ...restrict) => {
    return catchAsync(async (req, res, next) => {
        if (restrict.includes(req.user.role)) {
            return next();
        }

        const document = await Model.findById(req.params.id);
        if (!document) {
            return next(new AppError('Document is not exist !!!', 400));
        }
        if (!(document?.user?._id.toString() === req.user.id.toString())) {
            return next(new AppError("You don't have a permission to do this", 400));
        }
        next();
    });
};
