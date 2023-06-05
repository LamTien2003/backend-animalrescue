const mongoose = require('mongoose');
const validator = require('validator');

const animalSchema = mongoose.Schema(
    {
        name: {
            type: String,
            minlength: [1, 'Name of animal must more than 1 character'],
            maxlength: [50, 'Name of animal must less than 50 character'],
        },
        species: {
            type: String,
            required: [true, 'Animal must belong to some species'],
            enum: ['dog', 'cat'],
        },
        image: {
            type: String,
            required: [true, 'Must have image for animal'],
        },
        owner: {
            type: {
                name: {
                    type: String,
                    minlength: [1, 'Name of owner must more than 1 character'],
                    maxlength: [50, 'Name of the owner must less than 50 character'],
                    required: [true, 'Must have name of person who looking for an owner for this animal '],
                },
                phone: {
                    type: String,
                    minlength: [10, 'Phone number must have 10 character'],
                    maxlength: [10, 'Phone number must have 10 character'],
                    required: [true, 'Must have phone number of person who looking for an owner for this animal '],
                },
                address: {
                    type: String,
                    required: [true, 'Must have address of person who looking for an owner for this animal'],
                },
                email: {
                    type: String,
                    require: [true, 'Must have email of person who looking for an owner for this animal'],
                    validate: [validator.isEmail, 'Please provide a valid email'],
                },
            },
            required: [true, 'Must have owner for the animal'],
        },
        newOwner: {
            type: {
                name: {
                    minlength: [1, 'Name of the person who looking for an new owner must more than 1 character'],
                    maxlength: [50, 'Name of the person who looking for an new owner must less than 50 character'],
                    type: String,
                    required: [true, 'Must have name of person who looking for an new owner for this animal '],
                },
                phone: {
                    type: Number,
                    minlength: [10, 'Phone number must have 10 character'],
                    maxlength: [10, 'Phone number must have 10 character'],
                },
                address: {
                    type: String,
                    require: [true, 'Must have address of person who looking for an new owner for this animal'],
                },
                email: {
                    type: String,
                    require: [true, 'Must have email of person who looking for an new owner for this animal'],
                    validate: [validator.isEmail, 'Please provide a valid email'],
                },
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
