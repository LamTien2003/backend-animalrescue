const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.resizePhoto = (destination) => {
    return catchAsync(async (req, res, next) => {
        if (!req.file) return next();
        const random = Math.floor(Math.random() * 1000);
        const fileNameCreate = `${destination}-${random}-${Date.now()}.jpeg`;
        req.file.filename = `${process.env.DOMAIN_PRODUCTION}/img/${destination}/${fileNameCreate}`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/${destination}/${fileNameCreate}`);

        next();
    });
};
