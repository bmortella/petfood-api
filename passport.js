const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const Customer = require('./app/models/customer');

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req) => {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim();
  } else if (req.body.token) {
    token = req.body.token.trim();
  } else if (req.query.token) {
    token = req.query.token.trim();
  }

  return token;
};

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  Customer.findById(payload.data._id, (err, customer) => {
    if (err) {
      return done(err, false);
    }
    return !customer ? done(null, false) : done(null, customer);
  });
});

passport.use(jwtLogin);

/* Adaptado de:
* https://github.com/davellanedam/node-express-mongodb-jwt-rest-api-skeleton/blob/master/config/passport.js
*/
