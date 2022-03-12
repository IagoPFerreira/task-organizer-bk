const { INVALID_ENTRIES, SERVER_ERROR, ONLY_ADMINS_REGISTER } = require('../messages/errorMessages');
const service = require('../services/userService');

const createUser = async (req, res, next) => {
  const { body } = req;

  const user = await service.createUser(body);

  if (user.message) {
    const code = user.message === INVALID_ENTRIES ? 400 : 409;
    return next({ message: user.message, code });
  }

  return res.status(201).json({ data: user });
};

const login = async (req, res, next) => {
  const { body } = req;

  const token = await service.login(body);

  if (token.message) {
    return next({ message: token.message, code: 401 });
  }

  return res.status(200).json({ token });
};

const findAllUsers = async (_req, res, next) => {
  const users = await service.findAllUsers();

  if (users.message) return next({ message: users.message, code: 404 });

  return res.status(200).json({ data: users });
};

const createAdmin = async (req, res, next) => {
  const { body, user } = req;

  const newAdmin = await service.createAdmin(body, user);

  if (newAdmin.message) {
    let code;
    switch (newAdmin.message) {
      case SERVER_ERROR:
        code = 501;
        break;
      case ONLY_ADMINS_REGISTER:
        code = 403;
        break;
      case INVALID_ENTRIES:
        code = 400;
        break;
      default:
        code = 404;
        break;
    }
    return next({ message: newAdmin.message, code });
  }

  return res.status(201).json({ data: newAdmin });
};

module.exports = {
  createUser,
  login,
  findAllUsers,
  createAdmin,
};
