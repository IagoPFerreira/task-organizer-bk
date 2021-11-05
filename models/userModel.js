// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const coll = 'users';

const createUser = async (name, password, email, role) => {
  const newUser = await connection()
    .then((db) => db.collection(coll)
      .insertOne({
        name, password, email, role,
      }))
    .then((result) => {
      const { _id } = result.ops[0];
      return ({
        name, email, role, userId: _id,
      });
    });

  return newUser;
};

const existingEmail = async (email) => {
  const exists = await connection()
    .then((db) => db.collection(coll).findOne({ email }));

  return exists;
};

const checkLogin = async (email, password) => {
  const checkingUser = await connection()
    .then((db) => db.collection(coll).findOne({ email, password }));

  if (!checkingUser) return null;

  const { name, _id } = checkingUser;
  return ({ name, email, userId: _id });
};

const findAllUsers = async () => {
  const allUsers = await connection()
    .then((db) => db.collection(coll).find().toArray());

  return allUsers.map((user) => {
    const {
      name, email, role, _id,
    } = user;
    return ({
      name, email, role, userId: _id,
    });
  });
};

const updateUser = async (name, password, email, role) => connection()
  .then((db) => db.collection(coll)
    .updateOne(
      { email },
      {
        $set: {
          name, password, email, role,
        },
      },
      {
        upsert: true,
      },
    ))
  .then((result) => result.result.ok);

const createAdmin = async (name, password, email, role) => {
  const userToUpdate = await updateUser(name, password, email, role);

  if (userToUpdate === 1) {
    const { _id } = await existingEmail(email);
    return ({
      name, email, role, userId: _id,
    });
  }

  return false;
};

module.exports = {
  createUser,
  existingEmail,
  checkLogin,
  findAllUsers,
  createAdmin,
};
