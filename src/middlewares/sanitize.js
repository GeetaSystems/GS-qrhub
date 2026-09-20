'use strict';
const { sanitizeQuery } = require('../helpers/sanitize');
module.exports = (req,res,next) => { req.query = sanitizeQuery(req.query); next(); };
