// const Joi = require('joi');
const { validator } = require('cpf-cnpj-validator')
const Joi = require('@hapi/joi').extend(validator)

const createAccountSchema = Joi.object({
  nome: Joi.string().required(),
  cpf: Joi.document().cpf().required(),  
});

const depositsSchema = Joi.object({
  cpf: Joi.string().length(11).required(),  
  valor: Joi.number().min(1).max(2000).messages({
    'number.base': '"valor" deve ser um número',
    'number.min': '"valor" deve ser maior que zero',
    'number.max': '"valor" limite para depósito é de R$ 2000',
  }).required(),
});

const transfersSchema = Joi.object({
  de: Joi.string().length(11).required(),
  para: Joi.string().length(11).required(),
  valor: Joi.number().min(1).messages({
    'number.base': '"valor" deve ser um número',
    'number.min': '"valor" deve ser maior que 0',
    'number.not.empty': '"valor" não deve ser vazio',
  }).required(),
});

module.exports = {
  createAccountSchema,
  depositsSchema,
  transfersSchema,  
}