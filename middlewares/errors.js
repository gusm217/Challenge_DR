const errorStatus = {   
  cpfAlreadyRegistered: { code: 400, message: 'CPF already registered' },
  fromAccountNotFound: { code: 404, message: 'Source account not found' },
  toAccountNotFound: { code: 404, message: 'Target account not found' },
  insuficientBalance: { code: 409, message: 'Insuficient funds' },
  accountNotFound: { code: 404, message: 'Account not found' }
};

module.exports = (err, _req, res, _next) => {    
  const { code, message } = errorStatus[err];  

  res.status(code).json({ message: message });
};