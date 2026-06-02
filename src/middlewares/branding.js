'use strict';

const config = require('../config');

/**
 * Inject custom branding headers on every response.
 */
const brandingHeaders = (req, res, next) => {
  res.setHeader('X-Powered-By', config.service.vendor);
  res.setHeader('X-Service',    config.service.name);
  next();
};

module.exports = brandingHeaders;
