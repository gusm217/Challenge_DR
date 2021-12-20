const accountsModel = require('../models/Accounts');

const createAccount = async(account) => {
  const doesAccountExist = await accountsModel.findAccount(account.cpf);
  if (doesAccountExist) {
    return ({ message: 'CPF já cadastrado' });
  }
    
  return accountsModel.createAccount(account);
}

const transferBalance = async({ de, para, valor }) => {
  const fromAccount = await accountsModel.findAccount(de);
  const toAccount = await accountsModel.findAccount(para);

  if (!fromAccount) return ({ code: 404, message: 'Conta origem não encontrada' });
  if (!toAccount) return ({ code: 404, message: 'Conta destino não encontrada' });
  if (fromAccount.saldo < valor) return ({ code: 409, message: 'Saldo insuficiente' });

  await accountsModel.transferUpdate(de, { saldo: fromAccount.saldo - valor });
  await accountsModel.transferUpdate(para, { saldo: toAccount.saldo + valor });

  return ({ message: "Transferência realizada com sucesso" });
}

const deposit = async({ cpf, valor }) => {
  const account = await accountsModel.findAccount(cpf);
  if(!account) return ({ code: 404, message: 'Conta não encontrada' });
  
  await accountsModel.depositUpdate(cpf, valor);

  return ({ message: "Depósito realizado com sucesso" });
}

module.exports = {
  createAccount,
  transferBalance,
  deposit
}