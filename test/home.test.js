const chai = require('chai');
const chaiHTTP = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const {
  describe, before, after, it,
} = require('mocha');
const server = require('../api/index');
const { getConnection } = require('./connectionMock');

chai.use(chaiHTTP);

const { expect } = chai;

describe('GET /', () => {
  let db;

  before(async () => {
    const connectionMock = await getConnection();

    db = connectionMock.db('TaskOrganizer');

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando não tem tarefas registradas', async () => {
    const response = await chai.request(server).get('/');

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response).to.be.a('object');
    });

    it('o objeto possui a propriedade "data"', () => {
      expect(response.body).to.have.property('data');
    });

    it('a propriedade "data" possui o texto "Nenhuma tarefa cadastrada"', () => {
      expect(response.body.message).to.be.equal(
        'Nenhuma tarefa cadastrada',
      );
    });
  });
});
