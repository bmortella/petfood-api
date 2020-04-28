const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

  lojaId: {
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
  codBarras: {
    type: Number,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: false,
  },

});

module.exports = mongoose.model('Product', ProductSchema);
