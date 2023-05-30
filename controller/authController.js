const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const AppError = require('../utils/appError');

const genarateToken = (data, sercetKey, expriredTime) => {
    const token = jwt.sign(data, sercetKey, {
        expiresIn: expriredTime,
    });
    return token;
};

const createAndSendToken = (user, statusCode, res) => {
    const accessToken = genarateToken(user, process.env.JWT_ACCESS_KEY, process.env.JWT_EXPIRES_IN_ACCESS);
    const refreshToken = genarateToken(user, process.env.JWT_REFRESH_KEY, process.env.JWT_EXPIRES_IN_REFRESH);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    //   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', refreshToken, cookieOptions);

    return res.status(statusCode).json({
        status: 'success',
        accessToken: accessToken,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    console.log({ ...req.body, photo: req.file.filename });
    const newUser = await User.create({ ...req.body, photo: req.file.filename });
    createAndSendToken({ id: newUser._id }, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('You must enter full infomation !!!', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(user.password, password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createAndSendToken({ id: user._id }, 200, res);
});

exports.refreshToken = catchAsync(async (req, res, next) => {
    const { jwt: token } = req.cookies;

    const tokenDecoded = await promisify(jwt.verify)(token, process.env.JWT_REFRESH_KEY);
    if (!token || !tokenDecoded) {
        return next(new AppError('Token invalid', 401));
    }

    const user = await User.findOne({ _id: tokenDecoded.id });
    if (!user) {
        return next(new AppError('The user belong to this token nolonger exist', 401));
    }
    const accessToken = genarateToken({ id: user.id }, process.env.JWT_ACCESS_KEY, process.env.JWT_EXPIRES_IN_ACCESS);
    return res.status(200).json({
        status: 'success',
        accessToken,
    });
});

// exports.updateMyPassword = catchAsync(async (req, res, next) => {
//     const { currentPassword, password, passwordConfirm } = req.body;

//     const user = await User.findById(req.user.id).select('+password');
//     if (!(await user.correctPassword(user.password, currentPassword))) {
//         return next(new AppError('Password is wrong !!!', 401));
//     }

//     user.password = password;
//     user.passwordConfirm = passwordConfirm;
//     await user.save();

//     createAndSendToken({ id: user.id }, 200, res);
// });

exports.logout = catchAsync(async (req, res, next) => {
    res.clearCookie('jwt');
    res.status(200).json({
        status: 'success',
        message: 'Log out successfully !!! ',
    });
});
