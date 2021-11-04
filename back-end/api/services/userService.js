const model = require('../models/userModel');

const createUser = async ({ name, password, email }) => {
  const newUser = await model.createUser(name, password, email);

  return newUser;
};

module.exports = {
  createUser,
};
