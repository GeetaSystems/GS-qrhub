'use strict';
const config = require('../config');
const START  = Date.now();
module.exports.health = (req,res) => res.json({ success:true, service:config.service.name, status:'healthy', uptime_seconds:Math.floor((Date.now()-START)/1000), timestamp:new Date().toISOString() });
