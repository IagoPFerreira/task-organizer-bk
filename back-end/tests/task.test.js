const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const { MongoClient, Db } = require("mongodb");
const mock = require('./connectionMock')

chai.use(chaiHttp);

const server = require("../api/app/app");

describe("GET /tarefas", () => {
  let db;

  before(async () => {
    const connectionMock = await mock();

    db = connectionMock.db('TaskOrganizer');

    sinon.stub(MongoClient, "connect").resolves(connectionMock);
  });
  
  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando não existe nenhuma tarefa cadastrada', async () => {
    let response = {};

    before(async () => {
      response = await chai.request(server).get('/tarefas');
    });

    it('retorna o código de status 204', () => {
      expect(response).to.have.status(204);
    });

    it('retorna um objeto', () => {
      expect(response).to.be.a('object');
    });

    it('o objeto não possui a propriedade "data"', () => {
      expect(response).not.to.have.property('data');
    });
  });

  describe('Quando existem tarefas cadastradas', async () => {
    let response = {};

    before(async () => {
      response = await chai.request(server).post('/tarefas').send({
        name: 'Criar os testes da rota "/tarefas"',
        status: 'Em andamento',
        date: '03/11/2021'
      });
    });

    after(async () => {
      db.collection('tasks').deleteMany({
        name: 'Criar os testes da rota "/tarefas"',
        status: 'Em andamento',
        date: '03/11/2021'
      });
    });

    it('retorna o código de status 201', () => {
      expect(response).to.have.status(201);
    });

    it('retorna um objeto', () => {
      expect(response).to.be.a('object');
    });

    it('o objeto possui a propriedade "data"', () => {
      expect(response.body).to.have.property('data');
    });

    it('a propriedade "data" é um array de objetos', () => {
      expect(response.body.data).to.be.a('array');
      expect(response.body.data).to.have.length(1);
    });
  });
});
