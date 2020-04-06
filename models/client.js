/* eslint func-names: 0 */ //

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ClientSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ['cliente', 'loja'],
      default: 'cliente',
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

ClientSchema.pre('save', function (next) {
  if (this.isModified('senha')) {
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync(this.senha, salt);
    this.senha = passHash;
  }
  return next();
});

ClientSchema.methods.passwordMatch = function (password) {
  return bcrypt.compareSync(password, this.senha);
};

module.exports = mongoose.model('Client', ClientSchema);
