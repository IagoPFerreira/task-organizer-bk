const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const mock = require('./connectionMock');

chai.use(chaiHttp);

const server = require('../index');
const { INVALID_ENTRIES, EMAIL_ALREADY_REGISTRED, NO_REGISTRED_USERS } = require('../messages/errorMessages');

describe('GET /users', () => {
  let db;

  before(async () => {
    const connectionMock = await mock();

    db = connectionMock.db('TaskOrganizer');

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Casos de sucesso', () => {
    let token;

    before(async () => {
      await db.collection('users').deleteMany({});
      await chai
        .request(server)
        .post('/users')
        .send({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
      });

      token = await chai
        .request(server)
        .post('/login')
        .send({
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando existem usuários cadastrados', () => {
      let response;

      before(async () => {
        response = await chai
        .request(server)
        .get('/users')
        .set({ authorization: token });
      });

      after(async () => {
        db.collection('users').drop();
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it('a propriedade "data" é um array', () => {
        expect(response.body.data).to.be.a('array');
      });

      it('a propriedade "data" ter as propriedades do usuário', () => {
        expect(response.body.data[0]).to.have.property('name');
        expect(response.body.data[0]).to.have.property('email');
        expect(response.body.data[0]).to.have.property('id');
      });

      it('a propriedade "data" ter as informações do usuário', () => {
        expect(response.body.data[0].name).to.be.equal('Yarpen Zigrin');
        expect(response.body.data[0].email).to.be.equal(
          'yarpenzigrin@anao.com'
        );
      });
    });
  });
})

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
        await db.collection('users').deleteMany({});
        response = await chai.request(server).post('/users').send({
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        });
      });

      after(async () => {
        db.collection('users').drop();
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
