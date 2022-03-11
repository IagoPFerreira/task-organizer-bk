const service = require('../services/taskService');

const getAllTasks = async (req, res) => {
  const { status, data } = await service.getAllTasks(req.user);

  return res.status(status).json({ data });
};

const getTaskById = async (req, res) => {
  const { id } = req.params;

  const { status, data } = await service.getTaskById(id);

  return res.status(status).json({ data });
};

const insertTask = async (req, res) => {
  const { status, data } = await service.insertTask(req.body);

  return res.status(status).json({ data });
};

const updateTask = async (req, res) => {
  const { _id } = req.body;

  const { status, data } = await service.updateTask(_id, req.body);

  return res.status(status).json({ data });
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  const { status, data } = await service.deleteTask(id);

  return res.status(status).json({ data });
};

module.exports = {
  getAllTasks,
  getTaskById,
  insertTask,
  updateTask,
  deleteTask,
};
