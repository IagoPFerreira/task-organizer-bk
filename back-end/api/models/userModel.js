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
      return { user: userWithoutPassword };
    });

  return newUser;
};

module.exports = {
  createUser,
};
