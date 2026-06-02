'use strict';

const rateLimit = require('express-rate-limit');
const config    = require('../config');

/**
 * Configurable rate limiter — defaults to 100 req/min per IP.
 * Controlled via RATE_LIMIT env var.
 */
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max:      config.rateLimit.max,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders:   false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: `Rate limit exceeded. Max ${config.rateLimit.max} requests per minute.`,
    });
  },
});

module.exports = limiter;
