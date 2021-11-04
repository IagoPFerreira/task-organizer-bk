const model = require('../models/taskModel');

const getAllTasks = async () => {
  const tasks = await model.getAllTasks();

  if (!tasks) return ({ status: 404, data: 'Não existe tarefas cadastradas' });

  return ({ status: 200, data: tasks });
};

const getTaskById = async (id) => {
  const task = await model.getTaskById(id);

  if (!task) return ({ status: 404, data: 'Tarefa não encontrada.' });

  return ({ status: 200, data: task });
};

const insertTask = async ({ name, status }) => {
  if (!name || !status) return ({ status: 400, data: 'Entradas inválidas. Tente novamente.' });

  const task = await model.insertTask(name, status);

  if (!task) return ({ status: 500, data: 'Erro no servidor.' });

  return ({ status: 201, data: task });
};

const updateTask = async (id, {
  name, status, date,
}) => {
  if (!name || !status || !id) {
    return (
      { status: 400, data: 'Entradas inválidas. Tente novamente.' }
    );
  }

  const task = await model.updateTask(id, {
    name, status, id, date,
  });

  if (!task) return ({ status: 404, data: 'Tarefa não encontrada.' });

  return ({ status: 200, data: task });
};

const deleteTask = async (id) => {
  if (!id) return ({ status: 400, data: 'Entradas inválidas. Tente novamente.' });

  const task = await model.deleteTask(id);

  if (!task) return ({ status: 404, data: 'Tarefa não encontrada.' });

  return ({ status: 204 });
};

module.exports = {
  getAllTasks,
  getTaskById,
  insertTask,
  updateTask,
  deleteTask,
};
