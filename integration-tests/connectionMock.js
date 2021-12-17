const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const DBServer = new MongoMemoryServer();
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getConnection = async () => {
  await DBServer.start();
  const URLMock = DBServer.getUri();
  return MongoClient.connect(URLMock, OPTIONS);
};

module.exports = {
  getConnection,
};
