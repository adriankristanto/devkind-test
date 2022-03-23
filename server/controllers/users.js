const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// create a user when a user is registering to the authentication system
usersRouter.post("/", async (request, response, next) => {
  const { name, email, password } = request.body;

  // check for duplicate email address
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return response.status(400).json({
      error: "email address has already been taken",
    });
  }

  // 2 ^ 10 hashing iterations (Reference: https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt)
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    email,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
