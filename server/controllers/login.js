const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const validator = require("../utils/validator");
const config = require("../utils/config");
const logger = require("../utils/logger");

loginRouter.post(
  "/",
  validator.validateEmail,
  async (request, response, next) => {
    // validate email
    const errors = validator.validationResult(request);
    if (!errors.isEmpty()) {
      logger.info(
        `unsuccessful login attempt due to input validation failure: ${errors
          .array()
          .map((error) => JSON.stringify(error))}`
      );
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = request.body;

    // since user is not converted to JSON, it still has access to _id
    // only when it is returned to the client, e.g. response.status(201).json(savedUser);
    // the _id field will be removed
    const user = await User.findOne({ email });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      logger.info(
        `unsuccessful login attempt due to invalid email or password: ${email}`
      );
      return response.status(401).json({
        error: "invalid email or password",
      });
    }

    // Claims are statements about an entity (typically, the user) and additional data
    // reference: https://jwt.io/introduction
    const userForToken = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: "1h" });

    logger.info(`successful login attempt: ${email}`);

    response.status(200).send({ token, ...user.toJSON() });
  }
);

module.exports = loginRouter;
