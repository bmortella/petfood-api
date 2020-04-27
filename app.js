require('dotenv-safe').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  bodyParser.json({
    limit: '20mb',
  }),
);

app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true,
  }),
);

app.use(passport.initialize());

// Define rotas automaticamente pelo index.js
app.use(require('./app/routes'));

app.listen(process.env.PORT || 3000);

mongoose.connect(
  process.env.MONGO_URI,
  {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
);
console.log('Conectado ao banco.');
mongoose.connection.on('error', console.log);

console.log(`Servidor executando na porta ${process.env.PORT}`);

module.exports = app;
