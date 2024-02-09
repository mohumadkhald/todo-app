const AppError = require("../utlis/AppError.js");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const Jwt = require('jsonwebtoken')
const register = async (req, res, next) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return next(new AppError("Email And Password is Required", 400));
  }
  const hashPass = await bcrypt.hash(pass, 10);
  const userCreated = await User.create({ email, pass: hashPass });
  userCreated.pass = undefined;
  res.status(201).send(userCreated);
};

const login = async (req, res, next) => {
  const { email, pass } = req.body;
  try {
    const user = await User.findOne({ email }).select("+pass");
    if (!user) return next(new AppError("Invalid Credentials", 400));
    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) return next(new AppError("Invalid Credentials", 400));
    const token = Jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 3600
    });
    // Now, you can send both email and status
    res.send({
      status: "success",
      user,
      token: token
    });
  } catch (err) {
    return next(err); // Pass any errors to the error handling middleware
  }
};

module.exports = { register, login };
