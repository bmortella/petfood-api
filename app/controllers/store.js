const { matchedData } = require('express-validator');
const Store = require('../models/store');
const { handleError, buildErrObject } = require('./utils');

const createStore = async (costumer, data) => new Promise((resolve, reject) => {
  data.owner = costumer._id;
  Store.create(data, (err, item) => {
    if (err) return reject(err);
    return resolve(item);
  });
});


exports.register = async (req, res) => {
  try {
    const data = matchedData(req);
    if (req.user.tipo === 'cliente') {
      const store = await createStore(req.user, data);
      req.user.tipo = 'loja';
      req.user.loja = store._id;
      await req.user.save();
      res.status(201).json(store);
    } else {
      handleError(res, buildErrObject(422, 'STORE_ALREADY_EXISTS'));
    }
  } catch (err) {
    handleError(res, buildErrObject(422, err));
  }
};
