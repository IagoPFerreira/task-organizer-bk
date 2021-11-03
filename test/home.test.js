const chai = require('chai');
const chaiHTTP = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');

const server = require('../api/index');
const { getConnection } = require('./connectionMock');

chai.use(chaiHTTP);

const { expect } = chai;
