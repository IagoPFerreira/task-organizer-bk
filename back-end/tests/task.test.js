const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const mock = require('./connectionMock');

chai.use(chaiHttp);

const server = require('../api/app/app');

let currentId;

describe('GET /tarefas', () => {
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
    let token;

    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando não existe nenhuma tarefa cadastrada', async () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .get('/tarefas')
          .set({ authorization: token });
      });

      it('retorna o código de status 404', () => {
        expect(response).to.have.status(404);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it('a propriedade "data" possui o texto "Não existe tarefas cadastradas"', () => {
        expect(response.body.data).to.be.equal(
          'Não existe tarefas cadastradas'
        );
      });
    });
  });  

  describe('Casos de sucesso', () => {
    let token;

    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando existem tarefas cadastradas', async () => {
      let response = {};

      before(async () => {
        const { body: { data: { _id } } } = await chai
        .request(server)
        .post('/tarefas')
        .set({ authorization: token })
        .send({
          name: 'Criar os testes da rota "/tarefas"',
          status: 'Em andamento /get',
          date: '03/11/2021',
        });

        currentId = _id;

        response = await chai
        .request(server)
        .get('/tarefas')
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

      it('a propriedade "data" ter as propriedades da tarefa', () => {
        expect(response.body.data[0]).to.have.property('name');
        expect(response.body.data[0]).to.have.property('status');
        expect(response.body.data[0]).to.have.property('date');
        expect(response.body.data[0]).to.have.property('_id');
      });
    });
  });
});

describe('GET /tarefas/:id', () => {
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
    let token;

    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando a tarefa não está cadastrada', async () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .get('/tarefas/6183c3fd9d40282433fde788')
          .set({ authorization: token });
      });

      after(async () => {
        db.collection('users').drop();
      });

      it('retorna o código de status 404', () => {
        expect(response).to.have.status(404);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it('a propriedade "data" possui o texto "Tarefa não encontrada."', () => {
        expect(response.body.data).to.be.equal(
          'Tarefa não encontrada.'
        );
      });
    });
  });  

  describe('Casos de sucesso', () => {
    let token;

    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando a tarefa está cadastrada', async () => {
      let response = {};

      before(async () => {
        const {body: { data: { _id } } } = await chai
          .request(server)
          .post('/tarefas')
          .set({ authorization: token })
          .send({
          name: 'Criar os testes da rota "/tarefas"',
          status: 'Em andamento',
          date: '03/11/2021',
        });

        currentId = _id;

        response = await chai
          .request(server)
          .get(`/tarefas/${_id}`)
          .set({ authorization: token });
      });

      after(async () => {
        db.collection('tasks').deleteMany({
          name: 'Criar os testes da rota "/tarefas"',
          status: 'Em andamento',
          _id: currentId,
        });
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

      it('a propriedade "data" é um objeto', () => {
        expect(response.body.data).to.be.a('object');
      });

      it('a propriedade "data" ter as propriedades da tarefa', () => {
        expect(response.body.data).to.have.property('name');
        expect(response.body.data).to.have.property('status');
        expect(response.body.data).to.have.property('date');
        expect(response.body.data).to.have.property('_id');
      });
    });
  });
});

describe('POST /tarefas', () => {
  let db;

  before(async () => {
    const connectionMock = await mock();

    db = connectionMock.db('TaskOrganizer');

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Casos de falha', async () => {
    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando não é passado o "name"', () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .post('/tarefas')
          .set({ authorization: token })
          .send({
          status: 'Em andamento',
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

      it('a propriedade "data" possui o texto "Entradas inválidas. Tente novamente."', () => {
        expect(response.body.data).to.be.equal(
          'Entradas inválidas. Tente novamente.'
        );
      });
    });

    describe('Quando não é passado o "status"', () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .post('/tarefas')
          .set({ authorization: token })
          .send({
          name: 'Criar os testes da rota "/tarefas"',
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

      it('a propriedade "data" possui o texto "Entradas inválidas. Tente novamente."', () => {
        expect(response.body.data).to.be.equal(
          'Entradas inválidas. Tente novamente.'
        );
      });
    });
  });

  describe('Casos de sucesso', () => {
    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando todas as informações são passadas', async () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .post('/tarefas')
          .set({ authorization: token })
          .send({
          name: 'Criar os testes da rota "/tarefas"',
          status: 'Em andamento',
          date: '03/11/2021',
        });

        currentId = response.body.data['_id'];
      });

      after(async () => {
        db.collection('tasks').deleteMany({
          _id: currentId,
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

      it('a propriedade "data" é um object', () => {
        expect(response.body.data).to.be.a('object');
      });

      it('a propriedade "data" ter as propriedades da tarefa', () => {
        expect(response.body.data).to.have.property('name');
        expect(response.body.data).to.have.property('status');
        expect(response.body.data).to.have.property('date');
        expect(response.body.data).to.have.property('_id');
      });
    });
  });
});

describe('PUT /tarefas', () => {
  let db;

  before(async () => {
    const connectionMock = await mock();

    db = connectionMock.db('TaskOrganizer');

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Casos de falha', async () => {
    let token;
    let task;

    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);

      task = await chai
        .request(server)
        .post('/tarefas')
        .set({ authorization: token })
        .send({
        name: 'Criar os testes da rota "/tarefas"',
        status: 'Pendente',
        date: '03/11/2021',
      });
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando não é passado o "name"', () => {
      let response = {};

      before(async () => {
        const { _id } = task.body.data;
        response = await chai
          .request(server)
          .put('/tarefas')
          .set({ authorization: token })
          .send({
          status: 'Pendente',
          date: '03/11/2021',
          _id,
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

      it('a propriedade "data" possui o texto "Entradas inválidas. Tente novamente."', () => {
        expect(response.body.data).to.be.equal(
          'Entradas inválidas. Tente novamente.'
        );
      });
    });

    describe('Quando não é passado o "status"', () => {
      let response = {};

      before(async () => {
        const { _id } = task.body.data;
        response = await chai
          .request(server)
          .put('/tarefas')
          .set({ authorization: token })
          .send({
          name: 'Criar os testes da rota "/tarefas"',
          date: '03/11/2021',
          _id,
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

      it('a propriedade "data" possui o texto "Entradas inválidas. Tente novamente."', () => {
        expect(response.body.data).to.be.equal(
          'Entradas inválidas. Tente novamente.'
        );
      });
    });

    describe('Quando não é passado o "_id"', () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .put('/tarefas')
          .set({ authorization: token })
          .send({
          name: 'Criar os testes da rota "/tarefas"',
          status: 'Pendente',
          date: '03/11/2021',
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

      it('a propriedade "data" possui o texto "Entradas inválidas. Tente novamente."', () => {
        expect(response.body.data).to.be.equal(
          'Entradas inválidas. Tente novamente.'
        );
      });
    });
  });

  describe('Casos de sucesso', async () => {
    let token;
    let task;

    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);

      task = await chai
        .request(server)
        .post('/tarefas')
        .set({ authorization: token })
        .send({
          name: 'Criar os testes da rota "/tarefas"',
          status: 'Pendente',
          date: '03/11/2021',
      });
      
      currentId = task.body.data['_id']
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando todas as informações são passadas', () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .put('/tarefas')
          .set({ authorization: token })
          .send({
            name: 'Criar os testes da rota "/tarefas"',
            status: 'Concluída',
            _id: currentId,
        });
      });

      it('retorna o código de status 200', () => {
        expect(response).to.have.status(200);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', async () => {
        expect(response.body).to.have.property('data');
      });

      it('a propriedade "data" ter as propriedades da tarefa', () => {
        expect(response.body.data).to.have.property('name');
        expect(response.body.data).to.have.property('status');
        expect(response.body.data).to.have.property('date');
        expect(response.body.data).to.have.property('_id');
      });
    });
  });
});

describe('DELETE /tarefas/:id', () => {
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
    let token;
    let task;

    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);

      task = await chai
        .request(server)
        .post('/tarefas')
        .set({ authorization: token })
        .send({
          name: 'Criar os testes da rota "/tarefas"',
          status: 'Pendente',
          date: '03/11/2021',
      });
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando a tarefa não está cadastrada', async () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .delete('/tarefas/618310ab635c3b7aac2e07fa')
          .set({ authorization: token });
      });
      
      
      it('retorna o código de status 404', () => {
        expect(response).to.have.status(404);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).to.have.property('data');
      });

      it('a propriedade "data" possui o texto "Entradas inválidas. Tente novamente."', () => {
        expect(response.body.data).to.be.equal(
          'Tarefa não encontrada.'
        );
      });
    });
  });  

  describe('Casos de sucesso', () => {
    let token;
    let task;

    before(async () => {
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
          name: 'Yarpen Zigrin',
          email: 'yarpenzigrin@anao.com',
          password: '123456789',
        })
        .then(({ body }) => body.token);

      task = await chai
        .request(server)
        .post('/tarefas')
        .set({ authorization: token })
        .send({
          name: 'Criar os testes da rota "/tarefas"',
          status: 'Pendente',
          date: '03/11/2021',
      });
      
      currentId = task.body.data['_id']
    });

    after(async () => {
      db.collection('users').drop();
    });

    describe('Quando a tarefa está cadastrada', async () => {
      let response = {};

      before(async () => {
        response = await chai
          .request(server)
          .delete(`/tarefas/${currentId}`)
          .set({ authorization: token });
      });

      after(async () => {
        db.collection('tasks').drop();
      });

      it('retorna o código de status 204', () => {
        expect(response).to.have.status(204);
      });

      it('retorna um objeto', () => {
        expect(response).to.be.a('object');
      });

      it('o objeto possui a propriedade "data"', () => {
        expect(response.body).not.to.have.property('data');
      });
    });
  });
});
