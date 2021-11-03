const { MongoClient } = require('mongodb');
// require('dotenv').config();

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const MONGO_DB_URL = 'mongodb://localhost:27017/TaskOrganizer' || 'mongodb://mongodb:27017/TaskOrganizer';

let db = null;

const connection = () => (db
  ? Promise.resolve(db)
  : MongoClient.connect(MONGO_DB_URL, OPTIONS)
    .then((conn) => {
      db = conn.db('TaskOrganizer');
      return db;
    }));

module.exports = connection;
