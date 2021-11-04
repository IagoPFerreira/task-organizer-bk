const { ObjectId } = require('mongodb');
const connection = require('./connection');

const coll = 'users';

const createUser = async (name, password, email) => {
  const newUser = await connection()
    .then((db) => db.collection(coll)
      .insertOne({
        name, password, email, userId: new ObjectId(),
      }))
    .then((result) => {
      const { password: _, ...userWithoutPassword } = result.ops[0];
      const { _id } = userWithoutPassword;
      return { name, email, id: _id };
    });

  return newUser;
};

const existingEmail = async (email) => {
  const exists = await connection()
    .then((db) => db.collection(coll).findOne({ email }));

  if (exists) return false;

  return true;
};

module.exports = {
  createUser,
  existingEmail,
};
