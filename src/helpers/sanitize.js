'use strict';
const sanitizeString = (v) => typeof v==='string' ? v.replace(/\0/g,'').trim() : v;
const sanitizeQuery  = (q) => Object.fromEntries(Object.entries(q).map(([k,v])=>[k,sanitizeString(v)]));
const escapeForQr    = (v) => typeof v==='string' ? v.replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,') : v;
module.exports = { sanitizeString, sanitizeQuery, escapeForQr };
