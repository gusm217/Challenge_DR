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

const VALID_CPF = '54271113107';
const VALID_CPF_2 = '25634428777';
const VALID_BALANCE = 100;

describe('Tests for /accounts route', () => {
  let connectionMock;

  before(async function () {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async function () {
    MongoClient.connect.restore();
    await connectionMock.db('DR_Challenge').collection('accounts').deleteMany({});
  });  

  describe('Testing GET endpoint', function () {
    let response;

    before(async function () {
      response = await chai.request(app).get('/accounts');
    });

    it('should receive status code 200', function () {
      expect(response).to.have.status(200);
    });

    it('should receive an array with registered accounts', function () {
      expect(response.body).to.be.an('array');
    });
  });

  describe('Testing POST endpoint', function() {    
    describe('Tests to register new account', function () {
      afterEach(async function () {        
        await connectionMock.db('DR_Challenge').collection('accounts').deleteMany({});
      });

      describe('When already exists an account with given CPF', function() {
        let response;
  
        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertOne({            
            name: 'Person 1',
            cpf: VALID_CPF,
        });
  
        response = await chai.request(app).post('/accounts').send({
          name: 'Person 2',
          cpf: VALID_CPF,
        });
        });
  
        it('should receive status code 400', function() {
          expect(response).to.have.status(400);
        });
  
        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });
  
        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('CPF already registered');
        });
      })
      
      describe('When a new account is successfuly registered', function() {
        let response;
  
        before(async function() {
          response = await chai.request(app).post('/accounts').send({
            name: 'Person 2',
            cpf: VALID_CPF,
          });
        });
  
        it('should receive status code 201', function() {
          expect(response).to.have.status(201);
        });
  
        it('should receive an object as an answer', function() {
          expect(response.body).to.be.an('object');
        })
  
        it('should receive an object with the accounts properties', function() {
          expect(response.body).to.have.all.keys('name', 'cpf', 'balance');
        });
      });
    })
  });

  describe('Testing PUT endpoint', function() {
    describe('Transfers tests', function() {
      afterEach(async function () {        
        await connectionMock.db('DR_Challenge').collection('accounts').deleteMany({});
      });

      describe('When given CPF doesnt exist', function() {
        describe('When the source account is not found', function() {        
          let response;
  
          before(async function() {
            await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
            {              
              name: 'Person 1',
              cpf: VALID_CPF,
            },
            {
              name: 'Person 2',
              cpf: VALID_CPF_2,
            }
          ]);
  
            response = await chai.request(app).put('/accounts/transfers').send({
              from: '12345678988',
              to: VALID_CPF_2,
              amount: 1,
            });
          });
  
          it('should receive status code 404', function() {
            expect(response).to.have.status(404);
          });
  
          it('should receive an error object', function() {
            expect(response.body).to.be.an('object');
          });
  
          it('should receive the correct error message', function() {
            expect(response.body.message).to.be.equal('Source account not found');
          });
  
        describe('When the target account is not found', function() {
          let response;
  
          before(async function() {
            await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
            {
              name: 'Person 1',
              cpf: VALID_CPF,
            },
            {
              name: 'Person 2',
              cpf: VALID_CPF_2,
            }
          ]);
  
            response = await chai.request(app).put('/accounts/transfers').send({
              from: VALID_CPF,
              to: '12345678988',
              amount: 1,
            });
          });
  
          it('should receive status code 404', function() {
            expect(response).to.have.status(404);
          });
  
          it('should receive an error object', function() {
            expect(response.body).to.be.an('object');
          });
  
          it('should receive the correct error message', function() {
            expect(response.body.message).to.be.equal('Target account not found');
          });
        });
      });
  
      describe('When the transfer amount is not valid', function() {
        let response;
  
        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            name: 'Person 1',
            cpf: VALID_CPF,
          },
          {
            name: 'Person 2',
            cpf: VALID_CPF_2,
          }
        ]);
  
          response = await chai.request(app).put('/accounts/transfers').send({
            from: VALID_CPF,
            to: VALID_CPF_2,
            amount: 'abc',
          });
        });
  
        it('should receive status code 400', function() {
          expect(response).to.have.status(400);
        });
  
        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });
  
        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('"amount" must be a number');
        });
      });
  
      describe('When transfer amount is zero', function() {
        let response;
  
        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            name: 'Person 1',
            cpf: VALID_CPF,
          },
          {
            name: 'Person 2',
            cpf: VALID_CPF_2,
          }
        ]);
  
          response = await chai.request(app).put('/accounts/transfers').send({
            from: VALID_CPF,
            to: VALID_CPF_2,
            amount: 0,
          });
        });
  
        it('should receive status code 400', function() {
          expect(response).to.have.status(400);
        });
  
        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });
        
        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('"amount" must be greater than 0');
        });
      });

      describe('When transfer amount input is empty', function() {
        let response;

        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            name: 'Person 1',
            cpf: VALID_CPF,
          },
          {
            name: 'Person 2',
            cpf: VALID_CPF_2,
          }
        ]);
  
          response = await chai.request(app).put('/accounts/transfers').send({
            from: VALID_CPF,
            to: VALID_CPF_2,
            amount: '',
          });
        });       

        it('should receive status code 400', function() {
          expect(response).to.have.status(400);
        });

        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });

        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('"amount" must be a number');
        });
      });
      
      describe('When funds on source account is not enough', function() {
        let response;
  
        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            name: 'Person 1',
            cpf: VALID_CPF,
            balance: VALID_BALANCE,
          },
          {
            name: 'Person 2',
            cpf: VALID_CPF_2,
            balance: 0,
          }
        ]);
  
          response = await chai.request(app).put('/accounts/transfers').send({
            from: VALID_CPF,
            to: VALID_CPF_2,
            amount: 101,
          });
        });
  
        it('should receive status code 409', function() {
          expect(response).to.have.status(409);
        });
  
        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });
  
        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('Insuficient funds');
        });
      });

      describe('When transfer is successful', function() {
        let response;

        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertMany([
          {
            name: 'Person 1',
            cpf: VALID_CPF,
            balance: VALID_BALANCE,
          },
          {
            name: 'Person 2',
            cpf: VALID_CPF_2,
          }
        ]);

          response = await chai.request(app).put('/accounts/transfers').send({
            from: VALID_CPF,
            to: VALID_CPF_2,
            amount: 50,
          });
        });        

        it('should receive status code 200', function() {
          expect(response).to.have.status(200);
        });

        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });

        it('should receive the correct sucess message', function() {
          expect(response.body.message).to.be.equal('Transfer was successful');
        });
      });
    }); 
  })

    describe('Deposits tests', function() {
      afterEach(async function () {        
        await connectionMock.db('DR_Challenge').collection('accounts').deleteMany({});
      });

      describe('When theres no account with given CPF', function() {             
        let response;

        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
          {
            name: 'Person 1',
            cpf: VALID_CPF,
          },      
        );  

          response = await chai.request(app).put('/accounts/deposits').send({          
            cpf: VALID_CPF_2,
            amount: 1,
          });
        });

        it('should receive status code 404', function() {
          expect(response).to.have.status(404);
        });

        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });

        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('Account not found');
        });
      });

      describe('When the amount is not valid', function() {
        let response;

        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
          {
            name: 'Person 1',
            cpf: VALID_CPF,          
          },      
        );  

          response = await chai.request(app).put('/accounts/deposits').send({          
            cpf: VALID_CPF,
            amount: 'abc',
          });
        });

        it('should receive status code 400', function() {
          expect(response).to.have.status(400);
        });

        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });

        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('"amount" must be a number');
        });
      });

      describe('When the amount value is greather than 2000', function() {
        let response;

        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
          {
            name: 'Person 1',
            cpf: VALID_CPF,          
          },      
        );  

          response = await chai.request(app).put('/accounts/deposits').send({          
            cpf: VALID_CPF,
            amount: 2001,
          });
        });

        it('should receive status code 400', function() {
          expect(response).to.have.status(400);
        });

        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });

        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('"amount" limit for deposits is R$ 2000');
        });
      });

      describe('When the amount value is zero', function() {
        let response;

        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
          {
            name: 'Person 1',
            cpf: VALID_CPF,          
          },      
        );  

          response = await chai.request(app).put('/accounts/deposits').send({          
            cpf: VALID_CPF,
            amount: 0,
          });
        });

        it('should receive status code 400', function() {
          expect(response).to.have.status(400);
        });

        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });

        it('should receive the correct error message', function() {
          expect(response.body.message).to.be.equal('"amount" must be greater than 0');
        });
      });      

      describe('When the deposit is successful', function() {
        let response;

        before(async function() {
          await connectionMock.db('DR_Challenge').collection('accounts').insertOne(
          {
            name: 'Person 1',
            cpf: VALID_CPF,
            balance: VALID_BALANCE,
          },      
        );  

          response = await chai.request(app).put('/accounts/deposits').send({          
            cpf: VALID_CPF,
            amount: 50,
          });
        });

        it('should receive status code 200', function() {
          expect(response).to.have.status(200);
        });

        it('should receive an error object', function() {
          expect(response.body).to.be.an('object');
        });

        it('should receive the correct sucess message', function() {
          expect(response.body.message).to.be.equal('Deposit  was successful');
        });
      });
  });
})});