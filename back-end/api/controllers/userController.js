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

module.exports = {
  createUser,
  login,
};
