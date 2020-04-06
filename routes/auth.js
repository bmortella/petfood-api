const express = require('express');
const trimRequest = require('trim-request');
const controller = require('../controllers/auth');
const validate = require('../controllers/auth.validate');

const router = express.Router();

// Registro
router.post(
  '/register',
  trimRequest.all,
  validate.register,
  controller.register,
);

// Login
router.post(
  '/login',
  trimRequest.all,
  validate.login,
  controller.login,
);

module.exports = router;
