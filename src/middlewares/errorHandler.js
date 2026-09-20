'use strict';
const config = require('../config');
// eslint-disable-next-line no-unused-vars
module.exports = (err,req,res,next) => {
  const code = err.statusCode||err.status||500;
  const msg  = err.message||'An unexpected error occurred.';
  if(config.nodeEnv!=='production') console.error('[GS-QRHub Error]',err);
  else console.error(`[GS-QRHub Error] ${code}: ${msg}`);
  res.status(code).json({success:false,error:msg});
};
