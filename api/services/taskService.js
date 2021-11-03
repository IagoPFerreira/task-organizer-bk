const model = require('../models/taskModel');

const getAllTasks = async () => {
  const tasks = await model.getAllTasks();

  if (!tasks) return ({ status: 204 });

  return ({ status: 200, data: tasks });
};

module.exports = {
  getAllTasks,
};
