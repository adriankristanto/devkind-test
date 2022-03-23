const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");
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
      logger.info(
        `unsuccessful user registration attempt due to input validation failure: ${errors
          .array()
          .map((error) => JSON.stringify(error))}`
      );
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password, birthdate } = request.body;

    // check for duplicate email address
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.info(
        `unsuccessful user registration attempt due to email duplication: ${email}`
      );
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
      logger.info(
        `unsuccessful user registration attempt due to the user being under 18 years old: ${email}`
      );
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
      logger.info(`successful user registration attempt: ${email}`);
      response.status(201).json(savedUser);
    } catch (exception) {
      next(exception);
    }
  }
);

usersRouter.get("/profile", middleware.verifyJWT, async (request, response) => {
  try {
    logger.info(`fetching user profile: ${request.user.email}`);
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
      // validate email and birthdate
      const errors = validator.validationResult(request);
      if (!errors.isEmpty()) {
        logger.info(
          `unsuccessful user profile update attempt due to input validation failure: ${errors
            .array()
            .map((error) => JSON.stringify(error))}`
        );
        return response.status(400).json({
          errors: errors.array(),
        });
      }

      const user = await User.findOne({ email: request.user.email });

      const userCopy = { ...user };

      user.name = request.body.name || user.name;
      user.email = request.body.email || user.email;
      user.birthdate = request.body.birthdate || user.birthdate;
      user.passwordHash = request.body.password
        ? await bcrypt.hash(request.body.password, SALT_ROUNDS)
        : user.passwordHash;

      const savedUser = await user.save();
      logger.info(
        `successful user profile update attempt: old profile: ${JSON.stringify(
          userCopy
        )}, new profile: ${JSON.stringify(user)}`
      );
      response.status(201).json(savedUser);
    } catch (exception) {
      next(exception);
    }
  }
);

module.exports = usersRouter;
