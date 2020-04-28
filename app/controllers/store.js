const { matchedData } = require('express-validator');
const Store = require('../models/store');
const Product = require('../models/product');
const { handleError, buildErrObject } = require('./utils');

const createStore = async (costumer, data) => new Promise((resolve, reject) => {
  data.owner = costumer._id;
  Store.create(data, (err, item) => {
    if (err) return reject(err);
    return resolve(item);
  });
});

const updateStore = async (data) => new Promise((resolve, reject) => {
  Store.updateOne({_id: data._id}, data, (err, item) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve(item);
  })
});

const addProduct = async (data) => new Promise((resolve, reject) => {
  Product.create(data, (err, item) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve(item);
  });
});

const delProduct = async (id) => new Promise((resolve, reject) => {
  Product.deleteOne({_id: id}, (err) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve();
  })
})

const updateProduct = async (data) => new Promise((resolve, reject) => {
  Product.updateOne({_id: data._id}, data, (err, item) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve(item);
  })
})

const listProducts = async (id) => new Promise((resolve, reject) => {
  Product.find({lojaId: id}, (err, items) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve(items);
  })
})

exports.registerStore = async (req, res) => {
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

exports.updateStore = async (req, res) => {
  try {
    const data = matchedData(req);
    const item = await updateStore(data);
    res.status(200).json(item);
  } catch (err) {
    console.log(err)
    handleError(err);
  }
}

exports.registerProduct = async (req, res) => {
  try {
    const data = matchedData(req);
    const product = await addProduct(data);
    res.status(201).json(product);
  } catch (err) {
    handleError(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const data = matchedData(req);
    await delProduct(data.id);
    res.sendStatus(200);
  } catch (err) {
    handleError(err);
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const data = matchedData(req);
    const item = await updateProduct(data);
    res.status(200).json(item);
  } catch (err) {
    handleError(err);
  }
}

exports.listProducts = async (req, res) => {
  try {
    const data = matchedData(req);
    const items = await listProducts(data.id);
    res.status(200).json(items);
  } catch (err) {
    handleError(err);
  }
}