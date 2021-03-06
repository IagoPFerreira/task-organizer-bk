const service = require('../services/userService');

const createUser = async (req, res) => {
  const { body } = req;

  const { status, data } = await service.createUser(body);

  return res.status(status).json({ data });
};

const login = async (req, res) => {
  const { body } = req;

  const { status, data, token } = await service.login(body);

  if (token) {
    return res.status(status).json({ token });
  }

  return res.status(status).json({ data });
};

const findAllUsers = async (_req, res) => {
  const { status, data } = await service.findAllUsers();

  return res.status(status).json({ data });
};

const createAdmin = async (req, res) => {
  const { body, user } = req;

  const { status, data } = await service.createAdmin(body, user);

  return res.status(status).json({ data });
};

module.exports = {
  createUser,
  login,
  findAllUsers,
  createAdmin,
};
