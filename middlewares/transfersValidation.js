const Joi = require('joi');

const schema = Joi.object({
  de: Joi.string().length(11).required(),
  para: Joi.string().length(11).required(),
  valor: Joi.number().min(1).messages({
    'number.base': '"valor" deve ser um número',
    'number.min': '"valor" deve ser maior que 0',
  })
});

const transfersValidation = (req, res, next) => {
  const { de, para, valor } = req.body;
  const { error } = schema.validate({ de, para, valor });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();  
}

module.exports = {
  transfersValidation
};