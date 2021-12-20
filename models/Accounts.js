const connection = require('./connection');

const findAccount = async (cpf) => {
  return connection()
    .then((db) => db.collection('accounts').findOne({ cpf }))
    .then((result) => result)
    .catch((err) => console.log(err));
};

const createAccount = async (account) => {
  return connection()
    .then((db) => db.collection('accounts').insertOne({...account, saldo: 0}))
    .then(() => ({ ...account, saldo: 0 }))
    .catch((err) => err);
};

const transferUpdate = async (cpf, saldo) => {  
  return connection()
    .then((db) => db.collection('accounts').updateOne({ cpf }, { $inc: { saldo } }))
    .then((result) => result)
    .catch((err) => console.log(err));
};

const depositUpdate = async (cpf, valor) => {
  return connection()
    .then((db) => db.collection('accounts').updateOne({ cpf }, { $inc: { saldo: valor } }))
    .then((result) => result)
    .catch((err) => console.log(err));
};

module.exports = {
  createAccount,
  findAccount,  
  transferUpdate,
  depositUpdate,
}
