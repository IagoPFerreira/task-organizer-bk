const service = require('../services/userService');

const createUser = async (req, res) => {
  const { body } = req;

  const { status, data } = await service.createUser(body);

  return res.status(status).json({ data });
};

module.exports = {
  createUser,
};
