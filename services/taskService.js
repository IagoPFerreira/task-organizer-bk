const model = require('../models/taskModel');
const {
  TASK_NOT_FOUND, INVALID_ENTRIES,
} = require('../messages/errorMessages');

const getAllTasks = async ({ role, userId }) => {
  const tasks = role === 'admin' ? await model.getAllTasks() : await model.getTasksByUserId(userId);

  if (!tasks) return false;

  return tasks;
};

const getTaskById = async (id) => {
  const task = await model.getTaskById(id);

  if (!task) return false;

  return (task);
};

const insertTask = async ({ name, status }, { userId }) => {
  if (!name || !status) return ({ message: INVALID_ENTRIES });

  const task = await model.insertTask(name, status, userId);

  if (!task) return false;

  return (task);
};

const updateTask = async (id, { name, status, date }) => {
  if (!name || !status || !id) return ({ message: INVALID_ENTRIES });

  const task = await model.updateTask(id, { name, status, date });

  if (!task) return ({ status: 404, data: TASK_NOT_FOUND });

  return (task);
};

const deleteTask = async (id) => {
  if (!id) return ({ message: INVALID_ENTRIES });

  const task = await model.deleteTask(id);

  if (!task) return false;

  return true;
};

module.exports = {
  getAllTasks,
  getTaskById,
  insertTask,
  updateTask,
  deleteTask,
};
