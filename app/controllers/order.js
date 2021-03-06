const { matchedData } = require('express-validator');
const Order = require('../models/order');
const Store = require('../models/store');
const Product = require('../models/product');
const { handleError, buildErrObject } = require('./utils');

const fetchStore = async (id) => new Promise((resolve, reject) => {
 Store.findById(id, (err, item) => {
   if (err) return reject(buildErrObject(500, err));
   return resolve(item);
 })
});

const fetchProduct = async (id) => new Promise((resolve, reject) => {
  Product.findById(id, (err, item) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve(item);
  })
 });

const addOrder = async (customerId, data) => new Promise((resolve, reject) => {
  data.clienteId = customerId;
  Order.create(data, (err, item) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve(item);
  });
});

const delOrder = async (id) => new Promise((resolve, reject) => {
  Order.deleteOne({ _id: id }, (err) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve();
  });
});

const completeOrder = async (id) => new Promise((resolve, reject) => {
  const dNow = Date.now();
  Order.updateOne({ _id: id }, { finalizado: true, dataFinalizado: dNow }, (err, item) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve(item);
  });
});

const getOrders = async (filters) => new Promise((resolve, reject) => {
  Order.find(filters, (err, items) => {
    if (err) return reject(buildErrObject(500, err));
    return resolve(items);
  });
});

exports.newOrder = async (req, res) => {
  try {
    let data = matchedData(req);
    const store = await fetchStore(data.lojaId)
    const produto = await fetchProduct(data.produtoId)
    data.nomeLoja = store.nomeLoja;
    data.nomeCliente = req.user.nome;
    data.nomeProduto = produto.nomeProduto;
    const order = await addOrder(req.user._id, data);
    res.status(201).json(order);
  } catch (err) {
    handleError(err);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const data = matchedData(req);
    await delOrder(data.id);
    res.sendStatus(200);
  } catch (err) {
    handleError(err);
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const data = matchedData(req);
    await completeOrder(data.id);
    res.sendStatus(200);
  } catch (err) {
    handleError(err);
  }
};

exports.ordersSeller = async (req, res) => {
  try {
    if (!req.user.loja) {
      res.sendStatus(401);
      return;
    }
    const items = await getOrders({ lojaId: req.user.loja });
    res.status(200).json(items);
  } catch (err) {
    handleError(err);
  }
};

exports.orders = async (req, res) => {
  try {
    const items = await getOrders({ clienteId: req.user._id });
    res.status(200).json(items);
  } catch (err) {
    handleError(err);
  }
};
