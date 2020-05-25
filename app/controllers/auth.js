const { matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const { handleError, buildErrObject } = require('./utils');

const registerClient = async (req) => new Promise((resolve, reject) => {
  const customer = new Customer({
    email: req.email,
    senha: req.senha,
    nome: req.nome,
    cpf: req.cpf,
    telefone: req.telefone,
    estado: req.estado,
    cidade: req.cidade,
    bairro: req.bairro,
    rua: req.rua,
    numero: req.numero,
    complemento: req.complemento,
    cep: req.cep,
    dataNascimento: req.dataNascimento,
  });
  customer.save((err, item) => {
    if (err) {
      reject(buildErrObject(422, err));
    }
    resolve(item);
  });
});

const findCustomerByEmail = async (email) => new Promise((resolve, reject) => {
  Customer.findOne({ email }, (err, customer) => {
    if (err) {
      reject(buildErrObject(422, err));
    }
    if (!customer) {
      reject(buildErrObject(404, 'CUSTOMER_NOT_FOUND'));
    } else {
      resolve(customer);
    }
  });
});

exports.register = async (req, res) => {
  try {
    req = matchedData(req);
    const customer = await registerClient(req);
    const resData = {
      id: customer._id,
      token: jwt.sign({
        data: {
          _id: customer._id,
        },
      },
      process.env.JWT_SECRET),
    };
    res.status(201).json(resData);
  } catch (err) {
    handleError(res, err);
  }
};

exports.login = async (req, res) => {
  try {
    req = matchedData(req);
    const customer = await findCustomerByEmail(req.email);
    if (customer.passwordMatch(req.senha)) {
      res.status(200).json({
        token: jwt.sign({
          data: {
            _id: customer._id,
          },
        },
        process.env.JWT_SECRET),
        clientData: customer,
      });
    } else {
      handleError(res, buildErrObject(422, 'WRONG_PASSWORD'));
    }
  } catch (err) {
    console.log(err);
    handleError(res, buildErrObject(422, err));
  }
};
