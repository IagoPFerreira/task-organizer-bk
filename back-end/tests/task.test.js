const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const { MongoClient } = require("mongodb");
const mock = require('./connectionMock')

chai.use(chaiHttp);

const server = require("../api/app/app");

describe("GET /", () => {
  before(async () => {
    const connectionMock = await mock();;

    sinon.stub(MongoClient, "connect").resolves(connectionMock);
  });
  
  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Quando não existe nenhuma tarefa cadastrada', async () => {
    let response = {};

    before(async () => {
      response = await chai.request(server).get('/');
    })
    

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
});
