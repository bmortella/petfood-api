const express = require('express');
const trimRequest = require('trim-request');
require('../../passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {
  session: false,
});
const controller = require('../controllers/store');
const validate = require('../controllers/store.validate');


const router = express.Router();

// Se tornar loja
router.post(
  '/',
  requireAuth,
  trimRequest.all,
  validate.registerStore,
  controller.registerStore,
);

// Registrar produto
router.post(
  '/product',
  requireAuth,
  trimRequest.all,
  validate.registerProduct,
  controller.registerProduct,
);

module.exports = router;
