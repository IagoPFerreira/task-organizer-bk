const service = require('../services/taskService');


const getAllTasks = async (_req, res) => {
  const { status, data } = await service.getAllTasks();

  return res.status(status).json({ data });
};

const insertTask = async (req, res) => {
  const { status, data } = await service.insertTask(req.body);

  return res.status(status).json({ data });
};

module.exports = {
  getAllTasks,
  insertTask,
};
