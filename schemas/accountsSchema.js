// const Joi = require('joi');
const { validator } = require('cpf-cnpj-validator')
const Joi = require('@hapi/joi').extend(validator)

const createAccountSchema = Joi.object({
  nome: Joi.string().required(),
  cpf: Joi.document().cpf().required(),  
});

const depositsSchema = Joi.object({
  cpf: Joi.string().length(11).required().messages({
    'string.length': '"cpf" deve ter 11 caracteres',
  }),  
  valor: Joi.number().strict().min(1).max(2000).messages({
    'number.base': '"valor" deve ser um número',
    'number.min': '"valor" deve ser maior que zero',
    'number.max': '"valor" limite para depósito é de R$ 2000',
  }).required(),
});

const transfersSchema = Joi.object({
  de: Joi.string().length(11).required().messages({
    'string.length': '"cpf" da conta "de" deve ter 11 caracteres',
  }), 
  para: Joi.string().length(11).required().messages({
    'string.length': '"cpf" da conta "para" deve ter 11 caracteres',
  }), 
  valor: Joi.number().strict().min(1).messages({
    'number.base': '"valor" deve ser um número',
    'number.min': '"valor" deve ser maior que 0',    
  }).required(),
});

module.exports = {
  createAccountSchema,
  depositsSchema,
  transfersSchema,  
}