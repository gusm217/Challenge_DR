const accountsModel = require('../models/Accounts');

const createAccount = async({ name, cpf }) => {  
  const doesAccountExist = await accountsModel.findAccount(cpf);
  if (doesAccountExist) {
    return ( { error: 'cpfAlreadyRegistered'})
  }
    
  return accountsModel.createAccount({ name, cpf });
}

const transferBalance = async({ from, to, amount }) => {
  const fromAccount = await accountsModel.findAccount(from);  
  const toAccount = await accountsModel.findAccount(to);

  if (!fromAccount) return ({ error: 'fromAccountNotFound' });
  if (!toAccount) return ({ error: 'toAccountNotFound' });
  if (fromAccount.balance < amount) return ({ error: 'insuficientBalance' });

  await accountsModel.transferUpdate(from, amount * -1);
  await accountsModel.transferUpdate(to, amount);

  return ({ message: "Transfer was successful" });
}

const deposit = async({ cpf, amount }) => {
  const account = await accountsModel.findAccount(cpf);
  if(!account) return ({ error: 'accountNotFound' });
  
  await accountsModel.depositUpdate(cpf, amount);

  return ({ message: "Deposit  was successful" });
}

const getAllAccounts = async() => {
  return accountsModel.getAllAccounts();
}

module.exports = {
  createAccount,
  transferBalance,
  deposit,
  getAllAccounts
}