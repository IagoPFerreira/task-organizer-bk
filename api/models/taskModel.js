// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAllTasks = async () => {
  const tasks = await connection()
    .then((db) => db.collection('tasks').find().toArray());

  if (tasks.length === 0) return null;

  return tasks;
};

module.exports = {
  getAllTasks,
};
