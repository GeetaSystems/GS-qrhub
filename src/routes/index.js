'use strict';
const path   = require('path');
const { Router } = require('express');
const { generate } = require('../controllers/generateController');
const { health }   = require('../controllers/healthController');
const { info }     = require('../controllers/infoController');

const router = Router();
const UI_PATH   = path.join(__dirname,'../public/index.html');
const DOCS_PATH = path.join(__dirname,'../docs/index.html');

router.get('/ui',   (req,res) => res.sendFile(UI_PATH));
router.get('/docs', (req,res) => res.sendFile(DOCS_PATH));
router.get('/health', health);
router.get('/info',   info);
router.get('/', (req,res,next) => { if(!req.query.type) return res.sendFile(UI_PATH); next(); }, generate);
router.use('*', (req,res) => res.status(404).json({success:false,error:`Route not found. See /docs for usage.`}));

module.exports = router;
