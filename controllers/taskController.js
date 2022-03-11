const service = require('../services/taskService');
const { TASK_NOT_FOUND, NO_REGISTRED_TASKS, SERVER_ERROR } = require('../messages/errorMessages');

const getAllTasks = async (req, res, next) => {
  const tasks = await service.getAllTasks(req.user);

  if (!tasks) return next({ message: NO_REGISTRED_TASKS, code: 404 });

  return res.status(200).json({ data: tasks });
};

const getTaskById = async (req, res, next) => {
  const { id } = req.params;

  const task = await service.getTaskById(id);

  if (!task) {
    return next({ message: TASK_NOT_FOUND, code: 404 });
  }

  return res.status(200).json({ data: task });
};

const insertTask = async (req, res, next) => {
  const task = await service.insertTask(req.body, req.user);

  if (task.message) return next({ message: task.message, code: 400 });

  if (!task) return next({ message: SERVER_ERROR, code: 500 });

  return res.status(201).json({ data: task });
};

const updateTask = async (req, res, next) => {
  const task = await service.updateTask(req.body, req.user);

  if (task.message) return next({ message: task.message, code: 400 });

  if (!task) return next({ message: TASK_NOT_FOUND, code: 404 });

  return res.status(200).json({ data: task });
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  const task = await service.deleteTask(id);

  if (task.message) return next({ message: task.message, code: 400 });

  if (!task) return next({ message: TASK_NOT_FOUND, code: 404 });

  return res.status(204).json({ data: '' });
};

module.exports = {
  getAllTasks,
  getTaskById,
  insertTask,
  updateTask,
  deleteTask,
};
