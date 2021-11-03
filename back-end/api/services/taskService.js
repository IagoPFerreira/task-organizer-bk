const model = require('../models/taskModel');

const getAllTasks = async () => {
  const tasks = await model.getAllTasks();

  if (!tasks) return ({ status: 204 });

  return ({ status: 200, data: tasks });
};

const insertTask = async ({ name, status }) => {
  if (!name || !status) return ({ status: 400, data: 'Entradas inválidas. Tente novamente.' });

  const task = await model.insertTask(name, status);

  if (!task) return ({ status: 500, data: 'Erro no servidor.' });

  return ({ status: 201, data: task });
};

module.exports = {
  getAllTasks,
  insertTask,
};
