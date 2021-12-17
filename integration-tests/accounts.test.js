require('fast-text-encoding');
const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient, ObjectId } = require('mongodb');
const { getConnection } = require('./connectionMock');
const app = require('../index');
const { describe } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);

const VALID_ID = '617b6a525c769ab68b4036a0';

describe('Testes para a rota /accounts', () => {
  let connectionMock;

  before(async function () {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async function () {
    MongoClient.connect.restore();
    await connectionMock.db('DR_Challenge').collection('accounts').deleteMany({});
  });

  describe('Em caso de erro desconhecido', function() {
    let response;

    before(async function() {
      MongoClient.connect.resolves(null);
      response = await chai.request(app).get('/accounts');
    });

    after(async function () {
      MongoClient.connect.resolves(connectionMock);
    });

    it('deve receber um código HTTP 500', function() {
      expect(response).to.have.status(500);
      });
    
    it('deve receber um objeto de erro', function() {
      expect(response.body).to.be.an('object');
    });
  });

  describe('Testes para cadastro de uma nova conta', function () {
    describe('Quando já existe uma conta cadastrada no CPF', function() {
      let response;

      before(async function() {
        await connectionMock.db('DR_Challenge').collection('accounts').insertOne({
          _id: ObjectId(VALID_ID),
          nome: 'Fulano de Tal',
          cpf: '12345678901',
      });

      response = await chai.request(app).post('/accounts').send({
        nome: 'Sicrano de tal',
        cpf: '12345678901',
      });
      });

      it('deve receber um código 400', function() {
        expect(response).to.have.status(400);
      });

      it('deve receber um objeto de erro', function() {
        expect(response.body).to.be.an('object');
      });

      it('deve receber a mensagem de erro correta', function() {
        expect(response.body.message).to.be.equal('CPF já cadastrado');
      });
    })
    
    describe('Quando cadastra uma nova conta com sucesso', function() {
      let response;

      before(async function() {
        response = await chai.request(app).post('/accounts').send({
          nome: 'Sicrano de tal',
          cpf: '12345678902',
        });
      });

      it('deve receber status 201', function() {
        expect(response).to.have.status(201);
      });

      it('deve receber um objeto como resposta', function() {
        expect(response.body).to.be.an('object');
      })

      it('deve retornar o objeto com as chaves referentes à conta', function() {
        expect(response.body).to.have.keys('_id', 'nome', 'cpf');
      });
    });
  })
});
 