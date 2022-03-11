const model = require('../models/taskModel');
const {
  NO_REGISTRED_TASKS, TASK_NOT_FOUND, INVALID_ENTRIES, SERVER_ERROR,
} = require('../messages/errorMessages');

const getAllTasks = async ({ role, userId }) => {
  const tasks = role === 'admin' ? await model.getAllTasks() : await model.getTasksByUserId(userId);

  if (!tasks) return ({ status: 404, data: NO_REGISTRED_TASKS });

  return ({ status: 200, data: tasks });
};

const getTaskById = async (id) => {
  const task = await model.getTaskById(id);

  if (!task) return ({ status: 404, data: TASK_NOT_FOUND });

  return ({ status: 200, data: task });
};

const insertTask = async ({ name, status }, { userId }) => {
  if (!name || !status) return ({ status: 400, data: INVALID_ENTRIES });

  const task = await model.insertTask(name, status, userId);

  if (!task) return ({ status: 500, data: SERVER_ERROR });

  return ({ status: 201, data: task });
};

const updateTask = async (id, { name, status, date }) => {
  if (!name || !status || !id) {
    return (
      { status: 400, data: INVALID_ENTRIES }
    );
  }

  const task = await model.updateTask(id, { name, status, date });

  if (!task) return ({ status: 404, data: TASK_NOT_FOUND });

  return ({ status: 200, data: task });
};

const deleteTask = async (id) => {
  if (!id) return ({ status: 400, data: INVALID_ENTRIES });

  const task = await model.deleteTask(id);

  if (!task) return ({ status: 404, data: TASK_NOT_FOUND });

  return ({ status: 204 });
};

module.exports = {
  getAllTasks,
  getTaskById,
  insertTask,
  updateTask,
  deleteTask,
};
