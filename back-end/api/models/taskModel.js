const { ObjectId } = require('mongodb');
const connection = require('./connection');

const coll = 'tasks';

const getAllTasks = async () => {
  const tasks = await connection()
    .then((db) => db.collection(coll).find().toArray());

  if (tasks.length === 0) return null;

  return tasks;
};

const insertTask = async (name, status) => {
  // const date = new Date().toLocaleDateString('br');

  const task = await connection()
    .then((db) => db.collection(coll).insertOne({
      name, status, taskId: new ObjectId(),
    }))
    .then((result) => ({ ...result }));

  const tasks = await getAllTasks();
  console.log('🚀 ~ file: taskModel.js ~ line 17 ~ insertTask ~ task', tasks);

  return tasks;
};

module.exports = {
  getAllTasks,
  insertTask,
};
