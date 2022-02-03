const jwt = require('jsonwebtoken');
const model = require('../models/userModel');
const {
  EMAIL_ALREADY_REGISTRED, INVALID_ENTRIES, ALL_FILDES_FILLED,
  INCORRECT_USERNAME_OR_PASSWORD, NO_REGISTRED_USERS, ONLY_ADMINS_REGISTER,
  SERVER_ERROR,
} = require('../messages/errorMessages');

require('dotenv').config();

const jwtConfig = {
  expiresIn: '2h',
  algorithm: 'HS256',
};

const secret = process.env.SECRET || 'e717vdd^DEp.';

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

  if (existingEmail !== null) {
    return ({ status: 409, data: EMAIL_ALREADY_REGISTRED });
  }

  const newUser = await model.createUser(name, password, email);

  return ({ status: 201, data: newUser });
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    return ({ status: 401, data: ALL_FILDES_FILLED });
  }

  const loginCheck = await model.checkLogin(email, password);

  if (!loginCheck) {
    return ({ status: 401, data: INCORRECT_USERNAME_OR_PASSWORD });
  }

  const token = jwt.sign(loginCheck, secret, jwtConfig);

  return ({ status: 200, token });
};

const findAllUsers = async () => {
  const allUsers = await model.findAllUsers();

  if (allUsers.length === 0) {
    return ({ status: 404, data: NO_REGISTRED_USERS });
  }

  return ({ status: 200, data: allUsers });
};

const createAdmin = async ({
  name, password, email, role,
}, user) => {
  const { role: adminRole } = await model.existingEmail(user.email);

  if (adminRole !== 'admin') {
    return ({ status: 403, data: ONLY_ADMINS_REGISTER });
  }

  const newAdmin = await model.createAdmin(name, password, email, role);

  if (!newAdmin) return ({ status: 501, data: SERVER_ERROR });

  return ({ status: 201, data: newAdmin });
};

module.exports = {
  createUser,
  login,
  findAllUsers,
  createAdmin,
};
