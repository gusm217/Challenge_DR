const accountsService = require('../services/accounts');

const createAccount = async (req, res) => {
  try {
    const { nome, cpf } = req.body;

    const result = await accountsService.createAccount({nome, cpf});           
    if (result.message) {
      return res.status(400).json({ message: result.message});
    }

    return res.status(201).json(result);
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }  
}

const transferBalance = async (req, res) => {
  try {
    const { de, para, valor } = req.body;
    const transaction = await accountsService.transferBalance({ de, para, valor });        
    if (transaction.code) {
      return res.status(transaction.code).json({ message: transaction.message });
    }

    return res.status(200).json({ message: transaction.message});
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

const deposit = async (req, res) => {
  try {
    const { cpf, valor } = req.body;
    const transaction = await accountsService.deposit({ cpf, valor });        
    if (transaction.code) {
      return res.status(transaction.code).json({ message: transaction.message });
    }

    return res.status(200).json({ message: transaction.message});
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await accountsService.getAllAccounts();
    return res.status(200).json(accounts);
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

module.exports = {
  createAccount,
  transferBalance,
  deposit,
  getAllAccounts
}