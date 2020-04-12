const { validationResult } = require('express-validator');

exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    return res.status(422).json({ errors: err.array() });
  }
};

exports.buildErrObject = (code, message) => ({
  code,
  message,
});

exports.handleError = (res, err) => {
  res.status(err.code).json({
    errors: {
      msg: err.message,
    },
  });
};
