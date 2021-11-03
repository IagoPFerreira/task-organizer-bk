const connection = require('./connection');

const coll = 'tasks';

const getAllTasks = async () => {
  const tasks = await connection()
    .then((db) => db.collection(coll).find().toArray());

  if (tasks.length === 0) return null;

  return tasks;
};

const insertTask = async (name, status) => {
  const date = new Date().toLocaleDateString('br');

  const task = await connection()
    .then((db) => db.collection(coll).insertOne({
      name, status, date,
    }))
    .then((result) => ({ ...result.ops[0] }));

  return task;
};

// const updateTask = () => {

// };

module.exports = {
  getAllTasks,
  insertTask,
};
