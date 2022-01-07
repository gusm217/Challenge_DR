const rescue = require('express-rescue');
const accountsService = require('../services/accounts');

const createAccount = rescue(async (req, res, next) => {
  try {
    const { name, cpf } = req.body;

    const result = await accountsService.createAccount({ name, cpf });    
    if (result.error) return next(result.error);

    return res.status(201).json(result);
  } catch(err) {
    console.log(err);    
    return res.status(500).json({ message: 'Internal Server Error' });
  }  
});

const transferBalance = rescue(async (req, res, next) => {
  try {
    const { from, to, amount } = req.body;
    const transaction = await accountsService.transferBalance({ from, to, amount });        
    if (transaction.error) return next(transaction.error);      

    return res.status(200).json({ message: transaction.message});
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

const deposit = rescue(async (req, res, next) => {
  try {
    const { cpf, amount } = req.body;
    const transaction = await accountsService.deposit({ cpf, amount });        
    if (transaction.error) return next(transaction.error);      

    return res.status(200).json({ message: transaction.message});
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await accountsService.getAllAccounts();
    return res.status(200).json(accounts);
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  createAccount,
  transferBalance,
  deposit,
  getAllAccounts
}