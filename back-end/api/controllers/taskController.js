const service = require('../services/taskService');

const getAllTasks = async (_req, res) => {
  const { status, data } = await service.getAllTasks();

  return res.status(status).json({ data });
};

const insertTask = async (req, res) => {
  console.log('🚀 ~ file: taskController.js ~ line 11 ~ insertTask ~ req.body', req.body);
  const { status, data } = await service.insertTask(req.body);

  return res.status(status).json({ data });
};

module.exports = {
  getAllTasks,
  insertTask,
};
