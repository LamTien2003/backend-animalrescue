const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const cloudinary = require('../utils/cloudinary');
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadSinglePhoto = (nameInput) => {
    return upload.single(nameInput);
};

exports.resizeSmallPhoto = (destination) => {
    return catchAsync(async (req, res, next) => {
        if (!req.file) return next();
        const random = Math.floor(Math.random() * 1000);
        const fileNameCreate = `${destination}-${random}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/${destination}/${fileNameCreate}`);

        const result = await cloudinary.v2.uploader.upload(`public/img/${destination}/${fileNameCreate}`);
        req.file.filename = result.url;
        next();
    });
};
exports.resizePhoto = (destination) => {
    return catchAsync(async (req, res, next) => {
        if (!req.file) return next();
        const random = Math.floor(Math.random() * 1000);
        const fileNameCreate = `${destination}-${random}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/${destination}/${fileNameCreate}`);

        const result = await cloudinary.v2.uploader.upload(`public/img/${destination}/${fileNameCreate}`);
        req.file.filename = result.url;
        next();
    });
};
