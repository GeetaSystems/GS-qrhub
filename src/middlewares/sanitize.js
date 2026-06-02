'use strict';

const { sanitizeQuery } = require('../helpers/sanitize');

/**
 * Middleware that sanitizes all query string values in-place
 * before they reach controllers or validators.
 */
const sanitizeInputs = (req, res, next) => {
  req.query = sanitizeQuery(req.query);
  next();
};

module.exports = sanitizeInputs;
