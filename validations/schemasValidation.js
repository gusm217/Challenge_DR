const { createAccountSchema, depositsSchema, transfersSchema } = require('../schemas/accountsSchema');

const createValidation = (req, res, next) => {
  const { nome, cpf } = req.body;
  const { error } = createAccountSchema.validate({ nome, cpf }); 
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();  
}

const depositsValidation = (req, res, next) => {
  const { cpf, valor } = req.body;
  const { error } = depositsSchema.validate({ cpf, valor });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();  
}

const transfersValidation = (req, res, next) => {
  const { de, para, valor } = req.body;
  const { error } = transfersSchema.validate({ de, para, valor });
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