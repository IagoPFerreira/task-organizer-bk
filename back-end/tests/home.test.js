const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const { MongoClient } = require("mongodb");
const mock = require('./connectionMock')

chai.use(chaiHttp);

const server = require("../api/app/app");

// const {
//   StatusCodes: { CREATED, BAD_REQUEST },
// } = require("http-status-codes");

describe("1 - Using the endPoint /users", () => {
  describe("When a new user is created", async () => {
    let response = {};

    before(async () => {
      const connectionMock = await mock();;

      sinon.stub(MongoClient, "connect").resolves(connectionMock);
      // response = await chai.request(server).post("/users").send({
      //   name: "Silvinha Gianattasio",
      //   email: "silvinha@trybe.com",
      //   password: "123456",
      // });
      response = await chai.request(server).get('/');
    });
    
    after(async () => {
      MongoClient.connect.restore();
    });


    it('retorna o código de status 204', () => {
      expect(response).to.have.status(204);
    });

    it('retorna um objeto', () => {
      expect(response).to.be.a('object');
    });

    // it('returns Status HTTP 201 - "Created"', () => {
    //   expect(response).to.have.status(201);
    // });

    // it("return an Object", () => {
    //   expect(response.body).to.be.a("object");
    // });

    // it('with a "message" property', () => {
    //   expect(response.body).to.have.property("message");
    // });
    // it('and the message is: "Novo Usuário Cadastrado"', () => {
    //   expect(response.body.message).to.be.equal("Novo Usuário Cadastrado");
    // });
  });
});
