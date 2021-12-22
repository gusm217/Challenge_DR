const accountsModel = require('../models/Accounts');

const createAccount = async(account) => {  
  const doesAccountExist = await accountsModel.findAccount(account.cpf);
  if (doesAccountExist) {
    return ( { error: 'cpfAlreadyRegistered'})
  }
    
  return accountsModel.createAccount(account);
}

const transferBalance = async({ de, para, valor }) => {
  const fromAccount = await accountsModel.findAccount(de);  
  const toAccount = await accountsModel.findAccount(para);

  if (!fromAccount) return ({ error: 'fromAccountNotFound' });
  if (!toAccount) return ({ error: 'toAccountNotFound' });
  if (fromAccount.saldo < valor) return ({ error: 'insuficientBalance' });

  await accountsModel.transferUpdate(de, valor * -1);
  await accountsModel.transferUpdate(para, valor);

  return ({ message: "Transferência realizada com sucesso" });
}

const deposit = async({ cpf, valor }) => {
  const account = await accountsModel.findAccount(cpf);
  if(!account) return ({ error: 'accountNotFound' });
  
  await accountsModel.depositUpdate(cpf, valor);

  return ({ message: "Depósito realizado com sucesso" });
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