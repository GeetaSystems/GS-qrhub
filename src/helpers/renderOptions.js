'use strict';

const config = require('../config');

/**
 * Parse and normalize optional rendering parameters from query string.
 * Falls back to config defaults when values are absent or invalid.
 */
const parseRenderOptions = (query) => {
  const size = query.size ? parseInt(query.size, 10) : config.qr.defaultSize;
  const margin = query.margin !== undefined ? parseInt(query.margin, 10) : config.qr.defaultMargin;
  const darkColor = query.darkColor ? `#${query.darkColor}` : config.qr.defaultDarkColor;
  const lightColor = query.lightColor ? `#${query.lightColor}` : config.qr.defaultLightColor;
  const errorCorrectionLevel = query.errorCorrectionLevel
    ? query.errorCorrectionLevel.toUpperCase()
    : config.qr.defaultErrorCorrectionLevel;

  return { size, margin, darkColor, lightColor, errorCorrectionLevel };
};

module.exports = { parseRenderOptions };
