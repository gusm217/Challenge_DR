const errorStatus = {   
  cpfAlreadyRegistered: { code: 400, message: 'CPF já cadastrado' },
  fromAccountNotFound: { code: 404, message: 'Conta origem não encontrada' },
  toAccountNotFound: { code: 404, message: 'Conta destino não encontrada' },
  insuficientBalance: { code: 409, message: 'Saldo insuficiente' },
  accountNotFound: { code: 404, message: 'Conta não encontrada' }
};

module.exports = (err, _req, res, _next) => {    
  const { code, message } = errorStatus[err];  

  res.status(code).json({ message: message });
};