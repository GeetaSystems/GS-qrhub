'use strict';

const config = require('../config');

/**
 * Centralized error handler.
 * Never exposes stack traces in production.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message    = err.message || 'An unexpected error occurred.';

  // Log internally (full error in dev, message only in prod)
  if (config.nodeEnv !== 'production') {
    console.error('[GS-QRHub Error]', err);
  } else {
    console.error(`[GS-QRHub Error] ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
