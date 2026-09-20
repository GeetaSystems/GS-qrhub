'use strict';
const config = require('../config');
const parseRenderOptions = (q) => ({
  size:                 q.size   ? parseInt(q.size,10)   : config.qr.defaultSize,
  margin:               q.margin !== undefined ? parseInt(q.margin,10) : config.qr.defaultMargin,
  darkColor:            q.darkColor  ? `#${q.darkColor}`  : config.qr.defaultDarkColor,
  lightColor:           q.lightColor ? `#${q.lightColor}` : config.qr.defaultLightColor,
  errorCorrectionLevel: q.errorCorrectionLevel ? q.errorCorrectionLevel.toUpperCase() : config.qr.defaultErrorCorrectionLevel,
});
module.exports = { parseRenderOptions };
