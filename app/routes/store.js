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

// Editar loja
router.patch(
  '/',
  requireAuth,
  trimRequest.all,
  validate.updateStore,
  controller.updateStore,
);

// Registrar produto
router.post(
  '/product',
  requireAuth,
  trimRequest.all,
  validate.registerProduct,
  controller.registerProduct,
);

// Remover produto
router.delete(
  '/product/:id',
  requireAuth,
  trimRequest.all,
  validate.deleteProduct,
  controller.deleteProduct,
);

// Editar produto
router.patch(
  '/product',
  requireAuth,
  trimRequest.all,
  validate.updateProduct,
  controller.updateProduct,
);

// Listar produtos de uma loja
router.get(
  '/:id/products',
  requireAuth,
  trimRequest.all,
  validate.listProducts,
  controller.listProducts,
);

// Listar lojas
router.get(
  '/all',
  requireAuth,
  trimRequest.all,
  controller.listStores,
);

// Pegar loja
router.get(
  '/:id',
  requireAuth,
  trimRequest.all,
  validate.getStore,
  controller.getStore,
);

// // Fechar loja
// router.delete(
//   '/:id',
//   requireAuth,
//   trimRequest.all,
//   validate.deleteStore,
//   controller.deleteStore
// )

module.exports = router;
