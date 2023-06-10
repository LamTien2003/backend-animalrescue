const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Animal = require('../model/animalModel');

const sendMail = require('../utils/email');

exports.createAnimal = catchAsync(async (req, res, next) => {
    const payload = { ...req.body };

    if (req?.file?.filename) {
        payload.image = req.file.filename;
    }
    const animal = await Animal.create(payload);
    return res.status(200).json({
        status: 'success',
        message: 'Create a animal successfully',
        data: animal,
    });
});

exports.adoptAnimal = catchAsync(async (req, res, next) => {
    const { name, phone, address, email } = req.body;
    const animal = await Animal.findById(req.params.id);

    if (!animal) {
        return next(new AppError('This animal is no longer exist !!!', 400));
    }
    if (animal?.newOwner) {
        return next(new AppError('This animal already have another owner !!!'));
    }

    animal.newOwner = { name, phone, address };
    await sendMail({ name, phone, address, email, subject: 'Đã có người liên hệ nhận nuôi', to: animal.owner.email });
    await sendMail({
        name: animal.owner.name,
        phone: animal.owner.phone,
        address: animal.owner.address,
        email: animal.owner.email,
        subject: 'Đã liên hệ với chủ nhân của bé',
        to: email,
    });
    await animal.save();

    return res.status(200).json({
        status: 'success',
        message: 'Send a adopt request successfully',
    });
});

exports.getPendingAnimal = catchAsync(async (req, res, next) => {
    const animals = await Animal.find({ newOwner: undefined });

    return res.status(200).json({
        status: 'success',
        data: animals,
    });
});

exports.getAdoptedAnimal = catchAsync(async (req, res, next) => {
    const animals = await Animal.find({ newOwner: { $exists: true } });
    return res.status(200).json({
        status: 'success',
        data: animals,
    });
});

exports.getAnimal = catchAsync(async (req, res, next) => {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
        return next(new AppError('This animal is nolonger exist', 400));
    }
    return res.status(200).json({
        status: 'success',
        data: animal,
    });
});

exports.getAllAnimal = catchAsync(async (req, res, next) => {
    const animals = await Animal.find({});
    return res.status(200).json({
        status: 'success',
        data: animals,
    });
});
