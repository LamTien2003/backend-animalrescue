const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../model/userModel');

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('User belong to this id is nolonger exist !!! ', 400));
    }
    return res.status(200).json({
        status: 'success',
        data: user,
    });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        status: 'success',
        data: users,
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('There are not any user available'));
    }
    return res.status(200).json({
        status: 'success',
        data: user,
    });
});
