const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const mock = require('./connectionMock');

chai.use(chaiHttp);

const server = require('../api/app/app');
const { INVALID_ENTRIES, EMAIL_ALREADY_REGISTRED } = require('../messages/errorMessages');

describe('POST /users', () => {
  let db;

  before(async () => {
    const connectionMock = await mock();

    db = connectionMock.db('TaskOrganizer');

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Casos de falha', () => {
    describe('Quando não é passado o campo "name"', () => {
      let response;

      before(async () => {
        response = await chai.request(server).post('/users').send({
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        });
      });

      it('retorna o código de status 400', () => {
        expect(response).to.have.status(400);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it(`a propriedade "data" possui o texto "${INVALID_ENTRIES}"`, () => {
        expect(response.body.data).to.be.equal(INVALID_ENTRIES);
      });
    });

    describe('Quando não é passado o campo "email"', () => {
      let response;

      before(async () => {
        response = await chai.request(server).post('/users').send({
          name: 'Yarpen Zigrin',
          password: '123456789',
        });
      });

      it('retorna o código de status 400', () => {
        expect(response).to.have.status(400);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it(`a propriedade "data" possui o texto "${INVALID_ENTRIES}"`, () => {
        expect(response.body.data).to.be.equal(INVALID_ENTRIES);
      });
    });

    describe('Quando não é passado um e-mail válido no campo "email"', () => {
      let response;

      before(async () => {
        response = await chai.request(server).post('/users').send({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@',
          password: '123456789',
        });
      });

      it('retorna o código de status 400', () => {
        expect(response).to.have.status(400);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it(`a propriedade "data" possui o texto "${INVALID_ENTRIES}"`, () => {
        expect(response.body.data).to.be.equal(INVALID_ENTRIES);
      });
    });

    describe('Quando não é passado o campo "password"', () => {
      let response;

      before(async () => {
        response = await chai.request(server).post('/users').send({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
        });
      });

      it('retorna o código de status 400', () => {
        expect(response).to.have.status(400);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it(`a propriedade "data" possui o texto "${INVALID_ENTRIES}"`, () => {
        expect(response.body.data).to.be.equal(INVALID_ENTRIES);
      });
    });

    describe('Quando o e-mail passado não é único', () => {
      let response;

      before(async () => {
        await chai.request(server).post('/users').send({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        });

        response = await chai.request(server).post('/users').send({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        });
      });

      after(async () => {
        db.collection('users').drop();
        // .deleteMany({
        //   name: 'Yarpen Zigrin',
        //   email: 'yarpenzigrin@anao.com',
        //   password: '123456789',
        // });
      });

      it('retorna o código de status 409', () => {
        expect(response).to.have.status(409);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it(`a propriedade "data" possui o texto "${EMAIL_ALREADY_REGISTRED}"`, () => {
        expect(response.body.data).to.be.equal(EMAIL_ALREADY_REGISTRED);
      });
    });
  });

  describe('Casos de sucesso', () => {
    describe('Quando é possivel cadastrar um usuário', () => {
      let response;

      before(async () => {
        response = await chai.request(server).post('/users').send({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        });
      });

      after(async () => {
        db.collection('users').deleteMany({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
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

      it('a propriedade "data" é um objeto', () => {
        expect(response.body.data).to.be.a('object');
      });

      it('a propriedade "data" ter as informações do usuário', () => {
        expect(response.body.data.name).to.be.equal('Yarpen Zigrin');
        expect(response.body.data.email).to.be.equal(
          'yarpenzigrin@anao.com'
        );
        expect(response.body.data).to.have.property('id');
      });
    });
  });
});