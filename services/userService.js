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
    return ({ message: INVALID_ENTRIES });
  }

  return false;
};

const createUser = async ({ name, password, email }) => {
  const infoCheck = checkInfo(name, password, email);

  if (infoCheck) return infoCheck;

  const existingEmail = await model.existingEmail(email);

  if (existingEmail !== null) {
    return ({ message: EMAIL_ALREADY_REGISTRED });
  }

  const newUser = await model.createUser(name, password, email);

  return (newUser);
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    return ({ message: ALL_FILDES_FILLED });
  }

  const loginCheck = await model.checkLogin(email, password);

  if (!loginCheck) {
    return ({ message: INCORRECT_USERNAME_OR_PASSWORD });
  }

  const token = jwt.sign(loginCheck, secret, jwtConfig);

  return (token);
};

const findAllUsers = async () => {
  const allUsers = await model.findAllUsers();

  if (allUsers.length === 0) {
    return ({ message: NO_REGISTRED_USERS });
  }

  return (allUsers);
};

const createAdmin = async ({
  name, password, email, role,
}, user) => {
  const { role: adminRole } = await model.existingEmail(user.email);

  if (adminRole !== 'admin') {
    return ({ message: ONLY_ADMINS_REGISTER });
  }

  const newAdmin = await model.createAdmin(name, password, email, role);

  if (!newAdmin) return ({ message: SERVER_ERROR });

  return (newAdmin);
};

module.exports = {
  createUser,
  login,
  findAllUsers,
  createAdmin,
};
