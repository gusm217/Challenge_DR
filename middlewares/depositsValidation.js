const Joi = require('joi');

const schema = Joi.object({
  cpf: Joi.string().length(11).required(),  
  valor: Joi.number().min(1).max(2000).messages({
    'number': '"valor" deve ser um número',
    'number.min': '"valor" deve ser maior que 0',
    'number.max': '"valor" limite para depósito é de R$ 2000',
  })
});

const depositsValidation = (req, res, next) => {
  const { cpf, valor } = req.body;
  const { error } = schema.validate({ cpf, valor });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();  
}

module.exports = {
  depositsValidation
};