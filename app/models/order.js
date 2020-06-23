const mongoose = require('mongoose');
const Product = require('./product');

const OrderSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  nomeCliente: {
    type: String,
    required: true,
  },
  lojaId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  nomeLoja: {
    type: String,
    required: true,
  },
  produtoId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  nomeProduto: {
    type: String,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  finalizado: {
    type: Boolean,
    required: true,
    default: false,
  },
  dataFinalizado: {
    type: Date,
    required: false,
  },
  dataAberto: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
