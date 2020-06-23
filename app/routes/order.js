const express = require('express');
const trimRequest = require('trim-request');
require('../../passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {
  session: false,
});
const controller = require('../controllers/order');
const validate = require('../controllers/order.validate');


const router = express.Router();


// Fazer um pedido
router.post(
  '/',
  requireAuth,
  trimRequest.all,
  validate.newOrder,
  controller.newOrder,
);

// Cancelar pedido
router.delete(
  '/:id',
  requireAuth,
  trimRequest.all,
  validate.cancelOrder,
  controller.cancelOrder,
);

// Concluir pedido
router.patch(
  '/:id',
  trimRequest.all,
  validate.cancelOrder,
  controller.completeOrder,
);

// Ver pedidos (finalizados ou nao)
router.get(
  '/ordersSeller',
  requireAuth,
  trimRequest.all,
  controller.ordersSeller,
);

// Ver pedidos (finalizados ou nao)
router.get(
  '/orders',
  requireAuth,
  trimRequest.all,
  controller.orders,
);

module.exports = router;
