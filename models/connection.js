const { MongoClient } = require('mongodb');
require('dotenv').config();

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const MONGO_DB_URL = `mongodb://${process.env.DB_HOST}:27017/DR_Challenge`;
const DB_NAME = 'DR_Challenge';

let db = null;

const connection = () => (db
  ? Promise.resolve(db)
  : MongoClient.connect(MONGO_DB_URL, OPTIONS)
    .then((conn) => {
      db = conn.db(DB_NAME);
      return db;
    }));

module.exports = connection;
