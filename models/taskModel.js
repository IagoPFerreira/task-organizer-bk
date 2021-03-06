const { ObjectId } = require('mongodb');
const connection = require('./connection');

const coll = 'tasks';

const getAllTasks = async () => {
  const tasks = await connection().then((db) => db.collection(coll).find().toArray());

  if (tasks.length === 0) return null;

  return tasks;
};

const getTasksByUserId = async (userId) => {
  const tasks = await connection().then((db) => db.collection(coll).find({ userId }).toArray());

  if (tasks.length === 0) return null;

  return tasks;
};

const getTaskById = async (id) => {
  const task = await connection().then((db) => db.collection(coll).findOne({ _id: ObjectId(id) }));

  if (!task) return null;

  return task;
};

const insertTask = async (name, status, userId) => {
  const date = new Date().toLocaleDateString('br');

  const task = await connection()
    .then((db) => db.collection(coll).insertOne({
      name,
      status,
      date,
      userId,
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

const deleteTask = async (id) => {
  const taskToBeDeleted = await getTaskById(id);

  if (!taskToBeDeleted) return null;

  await connection()
    .then((db) => db.collection(coll).deleteOne({ _id: ObjectId(id) }));

  const deletedTask = await getTaskById(id);

  if (!deletedTask) return true;

  return false;
};

module.exports = {
  getAllTasks,
  getTasksByUserId,
  getTaskById,
  insertTask,
  updateTask,
  deleteTask,
};
