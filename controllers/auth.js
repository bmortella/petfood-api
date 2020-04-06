const { matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const Client = require('../models/client');
const { handleError, buildErrObject } = require('./utils');

const registerClient = async (req) => new Promise((resolve, reject) => {
  const client = new Client({
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
  client.save((err, item) => {
    if (err) {
      reject(buildErrObject(422, err));
    }
    resolve(item);
  });
});

const findClientByEmail = async (email) => new Promise((resolve, reject) => {
  Client.findOne({ email }, (err, client) => {
    if (err) {
      reject(buildErrObject(422, err));
    }
    if (!client) {
      reject(buildErrObject(404, 'CLIENT_NOT_FOUND'));
    } else {
      resolve(client);
    }
  });
});

exports.register = async (req, res) => {
  try {
    req = matchedData(req);
    const client = await registerClient(req);
    const resData = {
      id: client._id,
      token: jwt.sign({
        data: {
          _id: client._id,
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
    const client = await findClientByEmail(req.email);
    if (client.passwordMatch(req.senha)) {
      res.status(200).json({
        token: jwt.sign({
          data: {
            _id: client._id,
          },
        },
        process.env.JWT_SECRET),
        clientData: client,
      });
    } else {
      handleError(res, buildErrObject(422, 'WRONG_PASSWORD'));
    }
  } catch (err) {
    console.log(err);
    handleError(res, buildErrObject(422, err));
  }
};
