/* eslint no-undef: 0 */ //

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const server = require('../app');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

let createdClient;
let token;

describe('## AUTH', () => {
  describe('/POST register', () => {
    it('deve registrar cliente', (done) => {
      const client = {
        email: faker.internet.email(),
        senha: faker.internet.password(),
        nome: faker.name.findName(),
        cpf: faker.random.number(),
        telefone: faker.phone.phoneNumber(),
        estado: faker.address.state(),
        cidade: faker.address.city(),
        bairro: faker.lorem.words(2),
        rua: faker.address.streetAddress(),
        numero: faker.random.number(3),
        complemento: faker.lorem.words(),
        cep: faker.address.zipCode(),
        dataNascimento: faker.date.past(),
      };
      chai
        .request(server)
        .post('/auth/register')
        .send(client)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.include.keys('id', 'token');
          createdClient = client;
          done();
        });
    });

    it('nao deve registrar cliente (falta dados)', (done) => {
      const client = {
        email: faker.internet.email(),
        senha: faker.internet.password(),
        nome: faker.name.findName(),
        cpf: faker.random.number(),
        telefone: faker.phone.phoneNumber(),
        estado: faker.address.state(),
        cidade: faker.address.city(),
        bairro: faker.lorem.words(2),
        rua: faker.address.streetAddress(),
        dataNascimento: faker.date.past(),
      };
      chai
        .request(server)
        .post('/auth/register')
        .send(client)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.include.keys('errors');
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('deve fazer login', (done) => {
      const clientLogin = {
        email: createdClient.email,
        senha: createdClient.senha,
      };
      chai
        .request(server)
        .post('/auth/login')
        .send(clientLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.include.keys('token', 'clientData');
          token = res.body.token;
          done();
        });
    });
    it('nao deve fazer login (senha incorreta)', (done) => {
      const clientLogin = {
        email: createdClient.email,
        senha: '12345678',
      };
      chai
        .request(server)
        .post('/auth/login')
        .send(clientLogin)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.include.keys('errors');
          done();
        });
    });
  });
});

describe('## STORE', () => {
  describe('/POST /', () => {
    it('deve abrir loja', (done) => {
      const dados = {
        nomeLoja: faker.company.companyName(),
        cnpj: faker.random.number(),
        telComercial: faker.phone.phoneNumber(),
        cep: faker.address.zipCode(),
        endereco: faker.address.streetAddress(),
        numero: faker.random.number(),
        complemento: '',
      };
      chai
        .request(server)
        .post('/store')
        .set('Authorization', `Bearer ${token}`)
        .send(dados)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
