const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const middleware = require("../utils/middleware");
const validator = require("../utils/validator");

const SALT_ROUNDS = 10;

// create a user when a user is registering to the authentication system
usersRouter.post(
  "/",
  validator.validateEmail,
  validator.validateBirthdate,
  async (request, response, next) => {
    // validate email and birthdate
    const errors = validator.validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password, birthdate } = request.body;

    // check for duplicate email address
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        error: "email address has already been taken",
      });
    }

    // check whether the person is at least 18 years old
    // reference: https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd/7091965#7091965
    const today = new Date();
    const convertedBirthdate = new Date(birthdate);
    const monthsDifference = today.getMonth() - convertedBirthdate.getMonth();
    const daysDifference = today.getDate() - convertedBirthdate.getDate();
    // if today's month is smaller, this means birth month has not passed yet
    // if today's the birth month, check whether today's date is smaller
    const isBirthdateNotPassed =
      monthsDifference < 0 || (monthsDifference === 0 && daysDifference < 0);
    // if birthdate not passed yet, decrement age
    const age =
      today.getFullYear() -
      convertedBirthdate.getFullYear() -
      (isBirthdateNotPassed ? 1 : 0);
    if (age < 18) {
      return response.status(400).json({
        error: "user must be at least 18 years old to register",
      });
    }

    // 2 ^ 10 hashing iterations (Reference: https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User({
      name,
      birthdate,
      email,
      passwordHash,
    });

    try {
      const savedUser = await user.save();
      response.status(201).json(savedUser);
    } catch (exception) {
      next(exception);
    }
  }
);

usersRouter.get("/profile", middleware.verifyJWT, async (request, response) => {
  try {
    const user = await User.findOne({ email: request.user.email });
    response.json(user);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.post(
  "/profile",
  middleware.verifyJWT,
  validator.validateEmail,
  validator.validateBirthdate,
  async (request, response, next) => {
    try {
      const user = await User.findOne({ email: request.user.email });

      user.name = request.body.name || user.name;
      user.email = request.body.email || user.email;
      user.birthdate = request.body.birthdate || user.birthdate;
      user.passwordHash = request.body.password
        ? await bcrypt.hash(request.body.password, SALT_ROUNDS)
        : user.passwordHash;

      const savedUser = await user.save();
      response.status(201).json(savedUser);
    } catch (exception) {
      next(exception);
    }
  }
);

module.exports = usersRouter;
