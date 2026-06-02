'use strict';

const path        = require('path');
const express     = require('express');
const helmet      = require('helmet');
const cors        = require('cors');
const compression = require('compression');

const config         = require('./config');
const routes         = require('./routes');
const limiter        = require('./middlewares/rateLimit');
const brandingHeaders = require('./middlewares/branding');
const sanitizeInputs = require('./middlewares/sanitize');
const errorHandler   = require('./middlewares/errorHandler');

const app = express();

// ─── Security & performance middleware ────────────────────────────────────────
app.use(helmet({
  // Allow SVG responses inline (needed for browser preview)
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: config.cors.origins.includes('*')
    ? '*'
    : config.cors.origins,
}));

app.use(compression());

// ─── Branding headers ─────────────────────────────────────────────────────────
app.use(brandingHeaders);

// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use(limiter);

// ─── Input sanitization ───────────────────────────────────────────────────────
app.use(sanitizeInputs);

// ─── Body parsing (minimal — API is query-string only) ────────────────────────
app.use(express.json({ limit: '10kb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', routes);

// ─── Static assets (UI fallback) ──────────────────────────────────────────────
// Placed AFTER routes so API endpoints always take priority.
app.use(express.static(path.join(__dirname, 'public')));

// ─── Centralized error handling ───────────────────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  console.log(`[GS-QRHub] ${config.service.vendor} — ${config.service.name} v${config.service.version}`);
  console.log(`[GS-QRHub] Listening on port ${config.port} (${config.nodeEnv})`);
  console.log(`[GS-QRHub] Rate limit: ${config.rateLimit.max} req/min`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[GS-QRHub] SIGTERM received, shutting down gracefully…');
  server.close(() => {
    console.log('[GS-QRHub] Server closed.');
    process.exit(0);
  });
});

module.exports = app;
