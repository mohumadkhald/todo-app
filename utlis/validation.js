const Joi = require('joi');
const AppError = require('../utlis/AppError.js');
const User = require('../models/User'); // Assuming you have a User model

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    pass: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{8,30}"))
});

const validateRegisterMiddleware = async (req, res, next) => {
    try {
        // Validate the request body against the schema
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.details[0].message, 400, error.details));
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new AppError('Email is already registered', 400));
        }

        // If everything is fine, proceed to the next middleware
        next();
    } catch (err) {
        // Handle any unexpected errors
        return next(new AppError('Internal Server Error', 500));
    }
};

module.exports = { validateRegisterMiddleware };
