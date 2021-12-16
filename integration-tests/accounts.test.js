const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient, ObjectId } = require('mongodb');
const { getConnection } = require('./connectionMock');
const app = require('../index');
const { describe } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);

describe('Testes para a rota /accconunts', () => {
  let connectionMock;

  before(async function () {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async function () {
    MongoClient.connect.restore();
    await connectionMock.db('DR_Challenge').collection('accounts').deleteMany({});
  });

  descibre('Em caso de erro desconhecido', function() {
    let response;

    before(async function() {
      MongoClient.connect.resolves(null);
      response = await chai.request(app).get('/accounts');
    });

    after(async function () {
      MongoClient.connect.resolves(connectionMock);
    });

    it('Deve receber um código HTTP 500', function() {
      expect(response).to.have.status(500);
      });
    
    it('Deve receber um objeto de erro', function() {
      expect(response.body).to.be.an('object');
    });
  });
});
 