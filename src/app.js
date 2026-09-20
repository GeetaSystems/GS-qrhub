'use strict';
const path        = require('path');
const express     = require('express');
const helmet      = require('helmet');
const cors        = require('cors');
const compression = require('compression');
const config         = require('./config');
const routes         = require('./routes');
const limiter        = require('./middlewares/rateLimit');
const branding       = require('./middlewares/branding');
const sanitize       = require('./middlewares/sanitize');
const errorHandler   = require('./middlewares/errorHandler');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.cors.origins.includes('*') ? '*' : config.cors.origins }));
app.use(compression());
app.use(branding);
app.use(limiter);
app.use(sanitize);
app.use(express.json({ limit: '10kb' }));
app.use('/', routes);
app.use(express.static(path.join(__dirname,'public')));
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`[GS-QRHub] ${config.service.vendor} — ${config.service.name} v${config.service.version}`);
  console.log(`[GS-QRHub] Listening on port ${config.port} (${config.nodeEnv})`);
});
process.on('SIGTERM', () => server.close(() => process.exit(0)));
module.exports = app;
