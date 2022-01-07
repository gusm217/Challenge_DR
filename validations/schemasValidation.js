const { createAccountSchema, depositsSchema, transfersSchema } = require('../schemas/accountsSchema');

const createValidation = (req, res, next) => {
  const { name, cpf } = req.body;
  const { error } = createAccountSchema.validate({ name, cpf }); 
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();  
}

const depositsValidation = (req, res, next) => {
  const { cpf, amount } = req.body;
  const { error } = depositsSchema.validate({ cpf, amount });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();  
}

const transfersValidation = (req, res, next) => {
  const { from, to, amount } = req.body;
  const { error } = transfersSchema.validate({ from, to, amount });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();  
}

module.exports = {
  createValidation,
  depositsValidation,
  transfersValidation,
};