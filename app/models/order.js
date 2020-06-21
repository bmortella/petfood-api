const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  lojaId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  produtoId: {
    type: mongoose.Types.ObjectId,
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
});

module.exports = mongoose.model('Order', OrderSchema);
