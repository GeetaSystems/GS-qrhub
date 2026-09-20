'use strict';
const config = require('../config');
module.exports.info = (req,res) => {
  res.set('Content-Type','text/plain; charset=utf-8').send(`GS-QRHub v${config.service.version} — ${config.service.vendor}\nGET /?type=<type>&[params]\nSee /docs for full documentation.\nGET /health  GET /info  GET /ui  GET /docs`);
};
