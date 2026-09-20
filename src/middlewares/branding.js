'use strict';
const config = require('../config');
module.exports = (req,res,next) => { res.setHeader('X-Powered-By',config.service.vendor); res.setHeader('X-Service',config.service.name); next(); };
