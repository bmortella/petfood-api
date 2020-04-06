// CARREGA TODAS AS ROTAS AUTOMATICAMENTE

const express = require('express');

const router = express.Router();
const fs = require('fs');

const routesPath = `${__dirname}/`;

/*
 * Load routes statically and/or dynamically
 */

function removeExtensionFromFile(file) {
  return file.split('.').slice(0, -1).join('.').toString();
}

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter((file) => {
  // Take filename and remove last part (extension)
  const routeFile = removeExtensionFromFile(file);
  // Prevents loading of this file
  return routeFile !== 'index'
    // eslint-disable-next-line import/no-dynamic-require, global-require
    ? router.use(`/${routeFile}`, require(`./${routeFile}`))
    : '';
});

/*
 * Handle 404 error
 */
router.use('*', (req, res) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND',
    },
  });
});

module.exports = router;
