const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  nomeLoja: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    unique: true,
    required: true,
  },
  telComercial: {
    type: Number,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  endereco: {
    type: String,
    required: true,
  },
  numero: {
    type: Number,
    required: true,
  },
  complemento: {
    type: String,
    required: false,
  },

});

module.exports = mongoose.model('Store', StoreSchema);
