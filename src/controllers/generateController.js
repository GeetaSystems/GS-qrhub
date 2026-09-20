'use strict';
const { validators, validateRenderOptions } = require('../validators');
const { parseRenderOptions }                = require('../helpers/renderOptions');
const qr                                    = require('../services/qrService');
const { generateBarcode }                   = require('../services/barcodeService');

const DISPATCH = {
  qr:['qr',qr.generateQr], wifi:['wifi',qr.generateWifiQr], vcard:['vcard',qr.generateVCardQr],
  email:['email',qr.generateEmailQr], sms:['sms',qr.generateSmsQr], phone:['phone',qr.generatePhoneQr],
  geo:['geo',qr.generateGeoQr], whatsapp:['whatsapp',qr.generateWhatsappQr], event:['event',qr.generateEventQr],
  crypto:['crypto',qr.generateCryptoQr], otp:['otp',qr.generateOtpQr], barcode:['barcode',generateBarcode],
};

module.exports.generate = async (req,res,next) => {
  try {
    const { type } = req.query;
    if(!type) return res.status(400).json({success:false,error:'"type" is required. See /docs or /info.'});
    const entry = DISPATCH[type.toLowerCase()];
    if(!entry) return res.status(400).json({success:false,error:`Unknown type "${type}". Supported: ${Object.keys(DISPATCH).join(', ')}`});
    const [vk,fn] = entry;
    const tv = validators[vk](req.query); if(!tv.valid) return res.status(400).json({success:false,error:tv.error});
    const rv = validateRenderOptions(req.query); if(!rv.valid) return res.status(400).json({success:false,error:rv.error});
    const svg = await fn(req.query, parseRenderOptions(req.query));
    res.set('Content-Type','image/svg+xml').set('Cache-Control','public, max-age=3600').send(svg);
  } catch(e){ next(e); }
};
