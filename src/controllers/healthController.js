'use strict';

const config = require('../config');

const START_TIME = Date.now();

const health = (req, res) => {
  res.json({
    success:         true,
    service:         config.service.name,
    status:          'healthy',
    uptime_seconds:  Math.floor((Date.now() - START_TIME) / 1000),
    timestamp:       new Date().toISOString(),
  });
};

module.exports = { health };
