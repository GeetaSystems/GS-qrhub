'use strict';

const path   = require('path');
const { Router } = require('express');

const { generate } = require('../controllers/generateController');
const { health }   = require('../controllers/healthController');
const { info }     = require('../controllers/infoController');

const router = Router();

// ── UI — served at /ui (also redirect bare / with no ?type) ──────────────────
const UI_PATH = path.join(__dirname, '../public/index.html');

router.get('/ui', (req, res) => res.sendFile(UI_PATH));

// Core generation endpoint — if no ?type, show the UI instead of an API error
router.get('/', (req, res, next) => {
  if (!req.query.type) return res.sendFile(UI_PATH);
  next();
}, generate);

// Meta endpoints
router.get('/health', health);
router.get('/info',   info);

// Catch-all for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error:   `Route not found. See ${req.protocol}://${req.get('host')}/info for usage.`,
  });
});

module.exports = router;
