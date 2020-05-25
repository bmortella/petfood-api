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
let idLoja;
let produto;
let dadosLoja;

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
    it('nao deve abrir loja (dados faltando)', (done) => {
      const dados = {
        nomeLoja: faker.company.companyName(),
        cnpj: faker.random.number(),
        telComercial: faker.random.number(),
      };
      chai
        .request(server)
        .post('/store')
        .set('Authorization', `Bearer ${token}`)
        .send(dados)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it('deve abrir loja', (done) => {
      const dados = {
        nomeLoja: faker.company.companyName(),
        cnpj: faker.random.number(),
        telComercial: faker.random.number(),
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
          res.should.have.status(201);
          idLoja = res.body._id;
          dadosLoja = res.body;
          done();
        });
    });
    it('deve pegar dados loja', (done) => {
      chai
        .request(server)
        .get(`/store/${idLoja}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    });
    it('deve listar lojas', (done) => {
      chai
        .request(server)
        .get('/store/all')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })
    it('deve editar loja', (done) => {
      dadosLoja.nomeLoja = faker.company.companyName()
      chai
        .request(server)
        .patch('/store')
        .set('Authorization', `Bearer ${token}`)
        .send(dadosLoja)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('nao deve abrir loja (cliente ja eh loja)', (done) => {
      const dados = {
        nomeLoja: faker.company.companyName(),
        cnpj: faker.random.number(),
        telComercial: faker.random.number(),
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
          res.should.have.status(422);
          done();
        });
    });
  });
  describe('/POST product', () => {
    it('deve registrar produto', (done) => {
      const dados = {
        lojaId: idLoja,
        nomeProduto: faker.commerce.productName(),
        preco: faker.random.number(),
        codBarras: faker.random.number(),
        descricao: faker.lorem.sentence(),
        tags: faker.lorem.words(),
      };
      chai
        .request(server)
        .post('/store/product')
        .set('Authorization', `Bearer ${token}`)
        .send(dados)
        .end((err, res) => {
          res.should.have.status(201);
          produto = res.body;
          done();
        });
    });
    it('nao deve registrar produto (falta dados)', (done) => {
      const dados = {
        lojaId: idLoja,
        preco: faker.random.number(),
        descricao: faker.lorem.sentence(),
        tags: faker.lorem.words(),
      };
      chai
        .request(server)
        .post('/store/product')
        .set('Authorization', `Bearer ${token}`)
        .send(dados)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });
  describe('/PATCH product', () => {
    it('deve editar produto', (done) => {
      produto.nome = faker.commerce.productName();
      produto.preco = faker.random.number();
      chai
        .request(server)
        .patch(`/store/product`)
        .set('Authorization', `Bearer ${token}`)
        .send(produto)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })
  })
  describe('/GET products', () => {
    it('deve listar produtos', (done) => {
      chai
        .request(server)
        .get(`/store/${produto.lojaId}/products`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    });
  });
  describe('/DELETE product', () => {
    it('deve remover produto', (done) => {
      chai
        .request(server)
        .delete(`/store/product/${produto._id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
