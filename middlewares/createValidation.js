const Joi = require('joi');

const schema = Joi.object({
  nome: Joi.string().required(),
  cpf: Joi.string().length(11).required(),
  saldo: Joi.number().min(1).messages({
    'number': '"saldo" deve ser um número',
    'number.min': '"saldo" deve ser maior que 0',
  }),  
});

const createValidation = (req, res, next) => {
  const { nome, cpf } = req.body;
  const { error } = schema.validate({ nome, cpf });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();  
}

module.exports = {
  createValidation
};