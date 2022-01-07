// const Joi = require('joi');
const { validator } = require('cpf-cnpj-validator')
const Joi = require('@hapi/joi').extend(validator)

const createAccountSchema = Joi.object({
  name: Joi.string().required(),
  cpf: Joi.document().cpf().required(),  
});

const depositsSchema = Joi.object({
  cpf: Joi.string().length(11).required().messages({
    'string.length': '"cpf" should be 11 characters long',
  }),  
  amount: Joi.number().strict().min(1).max(2000).messages({
    'number.base': '"amount" must be a number',
    'number.min': '"amount" must be greater than 0',
    'number.max': '"amount" limit for deposits is R$ 2000',
  }).required(),
});

const transfersSchema = Joi.object({
  from: Joi.string().length(11).required().messages({
    'string.length': '"cpf" of "from" account should be 11 characters long',
  }), 
  to: Joi.string().length(11).required().messages({
    'string.length': '"cpf" of "to" account should be 11 characters long',
  }), 
  amount: Joi.number().strict().min(1).messages({
    'number.base': '"amount" must be a number',
    'number.min': '"amount" must be greater than 0',
  }).required(),
});

module.exports = {
  createAccountSchema,
  depositsSchema,
  transfersSchema,  
}