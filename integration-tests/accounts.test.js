require('fast-text-encoding');
const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const { getConnection } = require('./connectionMock');
const app = require('../index');
const { describe } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);

const VALID_CPF = '12345678901';
const VALID_CPF_2 = '12345678902';
const VALID_SALDO = 100;

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
      expect(response.body).to.be.an('array');
    });
  });

  describe('Testes para o endpoint GET', function () {
    let response;

    before(async function () {
      response = await chai.request(app).get('/accounts');
    });

    it('deve receber um código HTTP 200', function () {
      expect(response).to.have.status(200);
    });

    it('deve receber um array com as tarefas cadastradas', function () {
      expect(response.body).to.be.an('array');
    });
  });

  describe('Testes para as requisições POST', function() {    
    describe('Testes para cadastro de uma nova conta', function () {
      describe('Quando já existe uma conta cadastrada no CPF', function() {
        let response;
  
        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertOne({            
            nome: 'Fulano',
            cpf: VALID_CPF,
        });
  
        response = await chai.request(app).post('/accounts').send({
          nome: 'Sicrano',
          cpf: VALID_CPF,
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
            nome: 'Sicrano',
            cpf: VALID_CPF,
          });
        });
  
        it('deve receber status 201', function() {
          expect(response).to.have.status(201);
        });
  
        it('deve receber um objeto como resposta', function() {
          expect(response.body).to.be.an('object');
        })
  
        it('deve retornar o objeto com as propriedades referentes à conta', function() {
          expect(response.body).to.have.all.keys('nome', 'cpf', 'saldo');
        });
      });
    })
  });

  describe('Testes para as requisições PUT', function() {
    describe('Testes para realização de transferências', function() {
      describe('Quando não existe uma conta cadastrada com o CPF informado', function() {
        describe('Quando a conta de origem não é encontrada', function() {        
          let response;
  
          before(async function() {
            await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
            {              
              nome: 'Fulano',
              cpf: VALID_CPF,
            },
            {
              nome: 'Sicrano',
              cpf: VALID_CPF_2,
            }
          ]);
  
            response = await chai.request(app).put('/accounts/transfers').send({
              de: '12345678988',
              para: VALID_CPF_2,
              valor: 1,
            });
          });
  
          it('deve receber um código 404', function() {
            expect(response).to.have.status(404);
          });
  
          it('deve receber um objeto de erro', function() {
            expect(response.body).to.be.an('object');
          });
  
          it('deve receber a mensagem de erro correta', function() {
            expect(response.body.message).to.be.equal('Conta origem não encontrada');
          });
  
        describe('Quando a conta destino não é encontrada', function() {
          let response;
  
          before(async function() {
            await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
            {
              nome: 'Fulano',
              cpf: VALID_CPF,
            },
            {
              nome: 'Sicrano',
              cpf: VALID_CPF_2,
            }
          ]);
  
            response = await chai.request(app).put('/accounts/transfers').send({
              de: VALID_CPF,
              para: '12345678988',
              valor: 1,
            });
          });
  
          it('deve receber um código 404', function() {
            expect(response).to.have.status(404);
          });
  
          it('deve receber um objeto de erro', function() {
            expect(response.body).to.be.an('object');
          });
  
          it('deve receber a mensagem de erro correta', function() {
            expect(response.body.message).to.be.equal('Conta destino não encontrada');
          });
        });
      });
  
      describe('Quando o valor da transferência é inválido', function() {
        let response;
  
        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            nome: 'Fulano',
            cpf: VALID_CPF,
          },
          {
            nome: 'Sicrano',
            cpf: VALID_CPF_2,
          }
        ]);
  
          response = await chai.request(app).put('/accounts/transfers').send({
            de: VALID_CPF,
            para: VALID_CPF_2,
            valor: 'abc',
          });
        });
  
        it('deve receber um código 400', function() {
          expect(response).to.have.status(400);
        });
  
        it('deve receber um objeto de erro', function() {
          expect(response.body).to.be.an('object');
        });
  
        it('deve receber a mensagem de erro correta', function() {
          expect(response.body.message).to.be.equal('"valor" deve ser um número');
        });
      });
  
      describe('Quando o valor da transferência for zero', function() {
        let response;
  
        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            nome: 'Fulano',
            cpf: VALID_CPF,
          },
          {
            nome: 'Sicrano',
            cpf: VALID_CPF_2,
          }
        ]);
  
          response = await chai.request(app).put('/accounts/transfers').send({
            de: VALID_CPF,
            para: VALID_CPF_2,
            valor: 0,
          });
        });
  
        it('deve receber status 400', function() {
          expect(response).to.have.status(400);
        });
  
        it('deve receber um objeto de erro', function() {
          expect(response.body).to.be.an('object');
        });
        
        it('deve receber a mensagem de erro correta', function() {
          expect(response.body.message).to.be.equal('"valor" deve ser maior que 0');
        });
      });
      
      describe('Quando o saldo da conta origem é insuficiente', function() {
        let response;
  
        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            nome: 'Fulano',
            cpf: VALID_CPF,
            saldo: VALID_SALDO,
          },
          {
            nome: 'Sicrano',
            cpf: VALID_CPF_2,
            saldo: 0,
          }
        ]);
  
          response = await chai.request(app).put('/accounts/transfers').send({
            de: VALID_CPF,
            para: VALID_CPF_2,
            valor: 101,
          });
        });
  
        it('checa se o valor passado é maior que a quantia em saldo', function() {
          expect(response.valor).to.be.greaterThan(VALID_SALDO);
        });
  
        it('deve receber status 409', function() {
          expect(response).to.have.status(409);
        });
  
        it('deve um objeto de erro', function() {
          expect(response.body).to.be.an('object');
        });
  
        it('deve receber a mensagem de erro correta', function() {
          expect(response.body.message).to.be.equal('Saldo insuficiente');
        });
      });

      describe('Quando a transferência é realizada com sucesso', function() {
        let response;

        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            nome: 'Fulano',
            cpf: VALID_CPF,
            saldo: VALID_SALDO,
          },
          {
            nome: 'Sicrano',
            cpf: VALID_CPF_2,
          }
        ]);

          response = await chai.request(app).put('/accounts/transfers').send({
            de: VALID_CPF,
            para: VALID_CPF_2,
            valor: 50,
          });
        });        

        it('deve receber status 200', function() {
          expect(response).to.have.status(200);
        });

        it('deve receber um objeto de erro', function() {
          expect(response.body).to.be.an('object');
        });

        it('deve receber a mensagem de sucesso correta', function() {
          expect(response.body.message).to.be.equal('Transferência realizada com sucesso');
        });
      });
    }); 
  })

  describe('Testes para realização de depósitos', function() {
    describe('Quando não existe uma conta cadastrada com o CPF informado', function() {             
      let response;

      before(async function() {
        await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
        {
          nome: 'Fulano',
          cpf: VALID_CPF,
        },      
      );  

        response = await chai.request(app).put('/accounts/deposits').send({          
          cpf: VALID_CPF_2,
          valor: 1,
        });
      });

      it('deve receber um código 404', function() {
        expect(response).to.have.status(404);
      });

      it('deve receber um objeto de erro', function() {
        expect(response.body).to.be.an('object');
      });

      it('deve receber a mensagem de erro correta', function() {
        expect(response.body.message).to.be.equal('Conta não encontrada');
      });
    });

    describe('Quando o valor do depósito for inválido', function() {
      let response;

      before(async function() {
        await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
        {
          nome: 'Fulano',
          cpf: VALID_CPF,          
        },      
      );  

        response = await chai.request(app).put('/accounts/deposits').send({          
          cpf: VALID_CPF,
          valor: 'abc',
        });
      });

      it('deve receber um código 400', function() {
        expect(response).to.have.status(400);
      });

      it('deve receber um objeto de erro', function() {
        expect(response.body).to.be.an('object');
      });

      it('deve receber a mensagem de erro correta', function() {
        expect(response.body.message).to.be.equal('"valor" deve ser um número');
      });
    });

    describe('Quando o valor do depósito for maior que 2000', function() {
      let response;

      before(async function() {
        await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
        {
          nome: 'Fulano',
          cpf: VALID_CPF,          
        },      
      );  

        response = await chai.request(app).put('/accounts/deposits').send({          
          cpf: VALID_CPF,
          valor: 2001,
        });
      });

      it('deve receber um código 400', function() {
        expect(response).to.have.status(400);
      });

      it('deve receber um objeto de erro', function() {
        expect(response.body).to.be.an('object');
      });

      it('deve receber a mensagem de erro correta', function() {
        expect(response.body.message).to.be.equal('"valor" limite para depósito é de R$ 2000');
      });
    });

    describe('Quando o valor do depósito for igual a zero', function() {
      let response;

      before(async function() {
        await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
        {
          nome: 'Fulano',
          cpf: VALID_CPF,          
        },      
      );  

        response = await chai.request(app).put('/accounts/deposits').send({          
          cpf: VALID_CPF,
          valor: 0,
        });
      });

      it('deve receber um código 400', function() {
        expect(response).to.have.status(400);
      });

      it('deve receber um objeto de erro', function() {
        expect(response.body).to.be.an('object');
      });

      it('deve receber a mensagem de erro correta', function() {
        expect(response.body.message).to.be.equal('"valor" deve ser maior que zero');
      });
    });

    describe('Quando o depósito é realizado com sucesso', function() {
      let response;

      before(async function() {
        await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
        {
          nome: 'Fulano',
          cpf: VALID_CPF,
          saldo: VALID_SALDO,
        },      
      );  

        response = await chai.request(app).put('/accounts/deposits').send({          
          cpf: VALID_CPF,
          valor: 50,
        });
      });

      it('deve receber status 200', function() {
        expect(response).to.have.status(200);
      });

      it('deve receber um objeto de erro', function() {
        expect(response.body).to.be.an('object');
      });

      it('deve receber a mensagem de sucesso correta', function() {
        expect(response.body.message).to.be.equal('Depósito realizado com sucesso');
      });
    });
  });
})});