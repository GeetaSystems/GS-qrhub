'use strict';

const { validators, validateRenderOptions } = require('../validators');
const { parseRenderOptions }                = require('../helpers/renderOptions');
const qrService                             = require('../services/qrService');
const { generateBarcode }                   = require('../services/barcodeService');

/**
 * Dispatch table mapping ?type= values to their generator functions.
 * Each entry is: [validatorKey, generatorFn]
 */
const DISPATCH = {
  qr:         ['qr',         qrService.generateQr],
  wifi:       ['wifi',       qrService.generateWifiQr],
  vcard:      ['vcard',      qrService.generateVCardQr],
  email:      ['email',      qrService.generateEmailQr],
  sms:        ['sms',        qrService.generateSmsQr],
  phone:      ['phone',      qrService.generatePhoneQr],
  geo:        ['geo',        qrService.generateGeoQr],
  whatsapp:   ['whatsapp',   qrService.generateWhatsappQr],
  event:      ['event',      qrService.generateEventQr],
  crypto:     ['crypto',     qrService.generateCryptoQr],
  otp:        ['otp',        qrService.generateOtpQr],
  barcode:    ['barcode',    generateBarcode],
};

/**
 * Main generation controller.
 * Handles GET / — validates, dispatches, returns SVG.
 */
const generate = async (req, res, next) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        error: '"type" query parameter is required. See /info for usage.',
      });
    }

    const entry = DISPATCH[type.toLowerCase()];
    if (!entry) {
      return res.status(400).json({
        success: false,
        error: `Unknown type "${type}". Supported: ${Object.keys(DISPATCH).join(', ')}`,
      });
    }

    const [validatorKey, generatorFn] = entry;

    // Validate type-specific inputs
    const typeValidation = validators[validatorKey](req.query);
    if (!typeValidation.valid) {
      return res.status(400).json({ success: false, error: typeValidation.error });
    }

    // Validate shared rendering options
    const renderValidation = validateRenderOptions(req.query);
    if (!renderValidation.valid) {
      return res.status(400).json({ success: false, error: renderValidation.error });
    }

    const options = parseRenderOptions(req.query);
    const svg     = await generatorFn(req.query, options);

    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'public, max-age=3600');
    return res.send(svg);

  } catch (err) {
    next(err);
  }
};

module.exports = { generate };
