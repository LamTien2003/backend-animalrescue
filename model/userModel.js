const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please tell us your frist name'],
            maxlength: [30, 'First name should be less than 30 character'],
        },
        lastName: {
            type: String,
            required: [true, 'Please tell us your last name'],
            maxlength: [30, 'Last name should be less than 30 character'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        photo: {
            type: String,
            default: 'default.png',
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                // This only works on CREATE and SAVE!!! EVEN IF use options new and runValidator in findAndUpdate
                validator: function (value) {
                    // This === curent document
                    return value === this.password;
                },
                message: 'Passwords are not the same!',
            },
        },
        role: {
            type: String,
            enum: ['admin', 'manage', 'user'],
            default: 'user',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

userSchema.pre(/^find/, function (next) {
    this.select('-__v -createdAt -updatedAt');
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.passwordConfirm = undefined;
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async (userPassword, passwordFromUser) => {
    return await bcrypt.compare(passwordFromUser, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
