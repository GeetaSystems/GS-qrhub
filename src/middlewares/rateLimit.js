'use strict';
const rateLimit = require('express-rate-limit');
const config = require('../config');
module.exports = rateLimit({ windowMs:config.rateLimit.windowMs, max:config.rateLimit.max, standardHeaders:true, legacyHeaders:false, handler:(req,res)=>res.status(429).json({success:false,error:`Rate limit exceeded. Max ${config.rateLimit.max} requests per minute.`}) });
