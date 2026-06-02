'use strict';

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: parseInt(process.env.RATE_LIMIT, 10) || 100,
  },
  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
      : ['*'],
  },
  qr: {
    defaultSize: 300,
    defaultMargin: 4,
    defaultDarkColor: '#000000',
    defaultLightColor: '#ffffff',
    defaultErrorCorrectionLevel: 'M',
    validErrorLevels: ['L', 'M', 'Q', 'H'],
  },
  service: {
    name: 'GS-QRHub',
    version: '1.0.0',
    vendor: 'Geeta Systems',
  },
};

module.exports = config;
