'use strict';

const bwipjs = require('bwip-js');

/**
 * Maps user-facing format names to bwip-js encoder names.
 * bwip-js uses its own naming convention.
 */
const BARCODE_FORMAT_MAP = {
  code128:         'code128',
  code39:          'code39',
  ean13:           'ean13',
  ean8:            'ean8',
  upca:            'upca',
  upce:            'upce',
  interleaved2of5: 'interleaved2of5',
  'gs1-128':       'gs1-128',
  pdf417:          'pdf417',
  datamatrix:      'datamatrix',
};

/**
 * Generate a barcode as SVG using bwip-js.
 *
 * @param {object} query  - Parsed query params
 * @param {object} options - Render options (size, etc.)
 * @returns {Promise<string>} SVG string
 */
const generateBarcode = async (query, options = {}) => {
  const format = (query.format || 'code128').toLowerCase();
  const encoder = BARCODE_FORMAT_MAP[format];

  if (!encoder) {
    const err = new Error(`Unsupported barcode format: ${format}`);
    err.statusCode = 400;
    throw err;
  }

  // bwip-js uses "scale" (multiplier) rather than absolute px width.
  // We derive a sane scale from the requested size (default 300 → scale 3).
  const scale    = options.size ? Math.max(1, Math.round(options.size / 100)) : 3;
  const height   = options.barcodeHeight ? parseInt(options.barcodeHeight, 10) : 10;
  const includeText = query.includetext !== 'false';

  const bwipOptions = {
    bcid:          encoder,
    text:          query.text,
    scale,
    height,
    ...(includeText && { includetext: true }),
    textxalign:    'center',
    // bwip-js SVG color options use hex without #
    barcolor:      options.darkColor  ? options.darkColor.replace('#', '')  : '000000',
    backgroundcolor: options.lightColor ? options.lightColor.replace('#', '') : 'ffffff',
  };

  // bwip-js toSVG returns an SVG string directly
  const svg = await bwipjs.toSVG(bwipOptions);
  return svg;
};

module.exports = { generateBarcode };
