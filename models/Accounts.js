const connection = require('./connection');

const findAccount = async (cpf) => {
  return connection()
    .then((db) => db.collection('accounts').findOne({ cpf }))
    .then((result) => result)
    .catch((err) => console.log(err));
};

const createAccount = async ({ name, cpf }) => {
  return connection()
    .then((db) => db.collection('accounts').insertOne({ name, cpf, balance: 0}))
    .then(() => ({ name, cpf, balance: 0 }))
    .catch((err) => console.log(err));
};

const transferUpdate = async (cpf, balance) => {  
  return connection()
    .then((db) => db.collection('accounts').updateOne({ cpf }, { $inc: { balance } }))
    .then((result) => result)
    .catch((err) => console.log(err));
};

const depositUpdate = async (cpf, valor) => {
  return connection()
    .then((db) => db.collection('accounts').updateOne({ cpf }, { $inc: { balance: valor } }))
    .then((result) => result)
    .catch((err) => console.log(err));
};

const getAllAccounts = async () => {
  return connection()
    .then((db) => db.collection('accounts').find().toArray())
    .then((result) => result)
    .catch((err) => console.log(err));
};

module.exports = {
  createAccount,
  findAccount,  
  transferUpdate,
  depositUpdate,
  getAllAccounts
}
