const { body, validationResult } = require("express-validator");

const validateBirthdate = body("birthdate").isDate();
const validateEmail = body("email").isEmail();

module.exports = {
  validateBirthdate,
  validateEmail,
  validationResult,
};
