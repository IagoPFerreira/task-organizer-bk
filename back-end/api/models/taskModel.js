const { ObjectId } = require('mongodb');
const connection = require('./connection');

const coll = 'tasks';

const getAllTasks = async () => {
  const tasks = await connection().then((db) => db.collection(coll).find().toArray());

  if (tasks.length === 0) return null;

  return tasks;
};

const getTaskById = async (id) => {
  const task = await connection().then((db) => db.collection(coll).findOne({ _id: ObjectId(id) }));

  if (!task) return null;

  return task;
};

const insertTask = async (name, status) => {
  const date = new Date().toLocaleDateString('br');

  const task = await connection()
    .then((db) => db.collection(coll).insertOne({
      name,
      status,
      date,
    }))
    .then((result) => ({ ...result.ops[0] }));

  return task;
};

const updateTask = async (id, body) => {
  await connection()
    .then((db) => db.collection(coll).updateOne({ _id: ObjectId(id) }, { $set: { ...body } }));

  const task = await getTaskById(id);

  return task;
};

module.exports = {
  getAllTasks,
  getTaskById,
  insertTask,
  updateTask,
};
