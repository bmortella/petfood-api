/* eslint func-names: 0 */ //

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CustomerSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ['cliente', 'loja'],
      default: 'cliente',
    },
    loja: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    senha: {
      type: String,
      required: true,
    },
    nome: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
    },
    telefone: {
      type: String,
      required: false,
    },
    estado: {
      type: String,
      required: true,
    },
    cidade: {
      type: String,
      required: true,
    },
    bairro: {
      type: String,
      required: true,
    },
    rua: {
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
    cep: {
      type: String,
      required: true,
    },
    dataNascimento: {
      type: Date,
      required: true,
    },
  },
);

CustomerSchema.pre('save', function (next) {
  if (this.isModified('senha')) {
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync(this.senha, salt);
    this.senha = passHash;
  }
  return next();
});

CustomerSchema.methods.passwordMatch = function (password) {
  return bcrypt.compareSync(password, this.senha);
};

module.exports = mongoose.model('Customer', CustomerSchema);
