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
  validate.register,
  controller.register,
);

module.exports = router;
