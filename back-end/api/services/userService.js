const model = require('../models/userModel');
const { EMAIL_ALREADY_REGISTRED, INVALID_ENTRIES } = require('../../messages/errorMessages');

const checkInfo = (name, password, email) => {
  const regex = /\S+@\S+\.\S+/;

  if (!name || !password || !regex.test(email) || !email) {
    return ({ status: 400, data: INVALID_ENTRIES });
  }

  return false;
};

const createUser = async ({ name, password, email }) => {
  const infoCheck = checkInfo(name, password, email);

  if (infoCheck) return infoCheck;

  const existingEmail = await model.existingEmail(email);

  if (!existingEmail) {
    return ({ status: 409, data: EMAIL_ALREADY_REGISTRED });
  }

  const newUser = await model.createUser(name, password, email);

  return ({ status: 201, data: newUser });
};

module.exports = {
  createUser,
};
